import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Layout } from "../components/ui/Layout";
// import { Backend_URL } from "../config";
import axios from "axios";
import { ContentType } from "../components/ui/Sidebar";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

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
  const { shareHash } = useParams();
  const isSharedView = !!shareHash;

  const fetchContents = async () => {
    try {
      setLoading(true);
      toast.loading("Loading contents...", { id: "content-loading" });
      
      if (isSharedView) {
        const response = await axios.get(`/api/v1/brain/${shareHash}`);
        const sharedContents = response.data?.content || [];
        setAllContents(sharedContents);
        applyFilter(activeFilter, sharedContents);
        toast.success(`Loaded ${sharedContents.length} shared items`, { id: "content-loading" });
      } else {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(`/api/v1/content`, {
          headers: { "authorization": token }
        });

        const newContents = response.data?.content || [];
        setAllContents(newContents);
        applyFilter(activeFilter, newContents);
        toast.success(`Loaded ${newContents.length} items`, { id: "content-loading" });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load contents";
      setError(errorMsg);
      toast.error(errorMsg, { id: "content-loading" });
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
    if (isSharedView) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`/api/v1/delete`, {
        data: { contentId },
        headers: { "authorization": token }
      });

      const updatedContents = allContents.filter(content => content._id !== contentId);
      setAllContents(updatedContents);
      applyFilter(activeFilter, updatedContents);
      toast.success("Content deleted successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete content";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleContentAdded = () => {
    toast.success("Content added successfully");
    fetchContents();
    setModal(false);
  };

  useEffect(() => {  
    fetchContents();
  }, [shareHash]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <Layout 
      activeFilter={activeFilter} 
      onFilterChange={handleFilterChange}
      allContents={allContents}
      isSharedView={isSharedView}
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
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("Not authenticated");
                    
                    toast.loading("Generating share link...", { id: "share-link" });
                    const response = await axios.post(
                      `/api/v1/brain/share`,
                      { share: true },
                      { headers: { "authorization": token } }
                    );
                    
                    const shareUrl = `${window.location.origin}/share/${response.data.hash}`;
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Share link copied to clipboard!", { id: "share-link" });
                  } catch (err: any) {
                    const errorMsg = err.response?.data?.message || err.message || "Failed to generate share link";
                    toast.error(errorMsg, { id: "share-link" });
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