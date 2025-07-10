import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossICon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { Backend_URL } from "../../config";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onContentAdded: () => void;
}

enum ContentType {
  YOUTUBE = "Youtube",
  TWITTER = "Twitter",
  NOTION = "Notion",
  INSTAGRAM = "Instagram",
  FACEBOOK = "Facebook"
}

export const CreateContentModal = ({ open, onClose, onContentAdded }: ModalProps) => {
  const titleref = useRef<HTMLInputElement>(null);
  const linkref = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>(ContentType.YOUTUBE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContent = async () => {
    const title = titleref.current?.value?.trim();
    const link = linkref.current?.value?.trim();

    if (!title || !link) {
      setError("Please fill in both fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.post(`${Backend_URL}/api/v1/content`, {
        link,
        title,
        type,
      }, {
        headers: {
          "authorization": token,
        }
      });

      if (titleref.current) titleref.current.value = "";
      if (linkref.current) linkref.current.value = "";

      onContentAdded();
      onClose();
    } catch (err: any) {
      console.error("Error adding content:", err);
      setError(err.response?.data?.message || err.message || "Failed to add content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {open && (
        <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[90vw] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Content</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <CrossIcon size="md" />
              </button>
            </div>
            
            <div className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <Input 
                ref={titleref} 
                placeholder="Title" 
                className="w-full"
                disabled={isSubmitting}
              />
              <Input 
                ref={linkref} 
                placeholder="Link" 
                className="w-full"
                disabled={isSubmitting}
              />

              <div>
                <label className="font-semibold block mb-1">Content Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ContentType)}
                  className="w-full p-2 border rounded-md bg-slate-100 focus:outline-none"
                  disabled={isSubmitting}
                >
                  {Object.values(ContentType).map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center pt-2">
                <Button 
                  onClick={addContent} 
                  variant="primary" 
                  size="lg" 
                  text={isSubmitting ? "Submitting..." : "Submit"}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};