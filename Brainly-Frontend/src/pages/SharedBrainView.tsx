import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Layout } from "../components/ui/Layout";
// import { Backend_URL } from "../config";
import { ContentType } from "../components/ui/Sidebar";

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

interface SharedBrainResponse {
  username: string;
  content: Content[]; // Now expecting an array of Content
}

export default function SharedBrainView() {
  const { shareLink } = useParams();
  const [data, setData] = useState<SharedBrainResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<SharedBrainResponse>(
          `/api/v1/brain/${shareLink}`
        );
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareLink]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-4">No data found</div>;

  return (
    <Layout 
      activeFilter={null} 
      onFilterChange={() => {}} 
      allContents={data.content}
      // hideFilters // Add this prop to hide filters in Layout if needed
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-purple-600">
            Shared by: {data.username}
            <span className="text-sm text-gray-500 ml-2">
              ({data.content.length} items)
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.content.length > 0 ? (
            data.content.map((content) => (
              <Card
                key={content._id}
                contentId={content._id}
                title={content.title}
                type={content.type}
                link={content.link}
                createdAt={content.createdAt}
                onDelete={() => {}} // Disable delete functionality for shared view
                isSharedView // Add this prop if you want to modify card appearance for shared view
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No contents found in this shared brain
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}