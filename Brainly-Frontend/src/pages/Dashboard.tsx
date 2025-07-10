import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Layout } from "../components/ui/Layout";
import { Backend_URL } from "../config";
import axios from "axios";
import { ContentType } from "../components/ui/Sidebar";
import { useParams } from "react-router-dom";

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  tag?: string[];
  userId: string;
  createdAt?: Date;
}

export function Dashboard() {
  const [modal, setModal] = useState(false);
  const [allContents, setAllContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType | null>(null);
  const { shareHash } = useParams(); // Get share hash from URL if exists

  const isSharedView = !!shareHash; // Determine if this is a shared view

  const fetchContents = async () => {
    try {
      setLoading(true);
      
      if (isSharedView) {
        // Fetch shared content
        const response = await axios.get(`${Backend_URL}/api/v1/brain/${shareHash}`);
        const sharedContents = response.data?.content || [];
        setAllContents(sharedContents);
        applyFilter(activeFilter, sharedContents);
      } else {
        // Fetch user's own content
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(`${Backend_URL}/api/v1/content`, {
          headers: { "authorization": token }
        });

        const newContents = response.data?.content || [];
        setAllContents(newContents);
        applyFilter(activeFilter, newContents);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load contents");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (type: ContentType | null, contents: Content[] = allContents) => {
    if (type) {
      setFilteredContents(contents.filter(content => content.type === type));
    } else {
      setFilteredContents(contents);
    }
  };

  const handleFilterChange = (type: ContentType | null) => {
    setActiveFilter(type);
    applyFilter(type);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (isSharedView) return; // Disable delete in shared view
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${Backend_URL}/api/v1/delete`, {
        data: { contentId },
        headers: { "authorization": token }
      });

      const updatedContents = allContents.filter(content => content._id !== contentId);
      setAllContents(updatedContents);
      applyFilter(activeFilter, updatedContents);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete content");
    }
  };

  const handleContentAdded = () => {
    fetchContents(); // Refresh content when new content is added
    setModal(false);
  };

  useEffect(() => {  
    fetchContents();
  }, [shareHash]); // Refetch when shareHash changes

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <Layout 
      activeFilter={activeFilter} 
      onFilterChange={handleFilterChange}
      allContents={allContents}
      isSharedView={isSharedView} // Pass to Layout
    >
      {!isSharedView && (
        <CreateContentModal 
          open={modal} 
          onClose={() => setModal(false)}
          onContentAdded={handleContentAdded}
        />
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-purple-600">
            {isSharedView ? "Shared Contents" : activeFilter ? `${activeFilter} Contents` : "All Contents"} 
            <span className="text-sm text-gray-500 ml-2">({filteredContents.length} items)</span>
          </h1>
          
          {!isSharedView && (
            <div className="flex gap-2">
              <Button
                onClick={() => setModal(true)}
                StartIcon={<PlusIcon size="md" />}
                variant="primary"
                text="Add content"
                size="md"
              />
              <Button
                onClick={async () => {
                  try {
                    const response = await axios.post(`${Backend_URL}/api/v1/brain/share`, {
                      share: true
                    }, {
                      headers: { "authorization": localStorage.getItem("token") || "" } 
                    });
                    navigator.clipboard.writeText(`${window.location.origin}/share/${response.data.hash}`);
                    alert("Link copied to clipboard!");
                  } catch (err) {
                    console.error("Sharing failed:", err);
                  }
                }} 
                StartIcon={<ShareIcon size="md" />}
                variant="secondary"
                text="Share Brain"
                size="md"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.length > 0 ? (
            filteredContents.map((content) => (
              <Card
                key={content._id}
                contentId={content._id}
                title={content.title}
                type={content.type}
                link={content.link}
                createdAt={content.createdAt}
                onDelete={isSharedView ? undefined : handleDeleteContent}
                isSharedView={isSharedView}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No contents found{activeFilter ? ` for ${activeFilter}` : ""}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}