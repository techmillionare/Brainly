import { ReactElement } from "react";
import { format } from "date-fns";
import { DeleteIcon } from "../../icons/DeleteIcon";
import NotionIcon from "../../icons/notion-icon.svg";
import InstagramIcon from "../../icons/instagram-icon.svg";
import FacebookIcon from "../../icons/facebook-icon.svg";

interface CardProps {
  title: string;
  type: "Youtube" | "Twitter" | "Notion" | "Instagram" | "Facebook";
  link: string;
  contentId: string;
  createdAt?: Date;
  onDelete?: (contentId: string) => void; // Made optional
  startIcon?: ReactElement;
  description?: string;
  thumbnailUrl?: string;
  isSharedView?: boolean; // Added shared view support
}

export const Card = (props: CardProps) => {
  const creationDate = props.createdAt ? new Date(props.createdAt) : new Date();
  const date = format(creationDate, "dd MMM yyyy");

  const getYouTubeEmbedURL = (url: string) => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this content?")) {
      props.onDelete?.(props.contentId);
    }
  };

  const renderContent = () => {
    switch (props.type) {
      case "Youtube":
        return (
          <div className="h-full">
            <iframe
              className="w-full h-full rounded-md"
              src={getYouTubeEmbedURL(props.link)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        );
      
      case "Twitter":
        return (
          <div className="h-full overflow-y-auto custom-scroll">
            <blockquote className="twitter-tweet">
              <a href={props.link.replace("x.com", "twitter.com")}></a>
            </blockquote>
          </div>
        );
      
      case "Notion":
        return (
          <div className="h-full flex flex-col">
            {props.thumbnailUrl ? (
              <div className="flex-1 mb-3 overflow-hidden rounded-t-md">
                <img 
                  src={props.thumbnailUrl} 
                  alt="Notion page thumbnail" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-t-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img 
                    src={NotionIcon} 
                    alt="Notion Icon" 
                    className="w-32 h-32 text-gray-300"
                  />
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium text-gray-600">Notion Page</h3>
                    <p className="text-sm text-gray-400 max-w-xs truncate">{props.title}</p>
                  </div>
                </div>
              </div>
            )}
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 p-1 bg-white text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 truncate rounded-b-md border-t border-gray-100 transition-colors"
            >
              {props.link}
            </a>
          </div>
        );
      
      case "Instagram":
        return (
          <div className="h-full flex flex-col">
            {props.thumbnailUrl ? (
              <div className="flex-1 mb-3 overflow-hidden">
                <img 
                  src={props.thumbnailUrl} 
                  alt="Instagram thumbnail" 
                  className="w-full h-full object-contain rounded-md border border-gray-200"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-t-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img 
                    src={InstagramIcon} 
                    alt="Instagram Icon" 
                    className="w-32 h-32 text-gray-300"
                  />
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium text-gray-600">Instagram Post</h3>
                    <p className="text-sm text-gray-400 max-w-xs truncate">{props.title}</p>
                  </div>
                </div>
              </div>
            )}
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 p-1 bg-white text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 truncate rounded-b-md border-t border-gray-100 transition-colors"
            >
              View on Instagram
            </a>
          </div>
        );
      
      case "Facebook":
        return (
          <div className="h-full flex flex-col">
            {props.thumbnailUrl ? (
              <div className="flex-1 mb-3 overflow-hidden">
                <img 
                  src={props.thumbnailUrl} 
                  alt="Facebook thumbnail" 
                  className="w-full h-full object-contain rounded-md border border-gray-200"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-t-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <img 
                    src={FacebookIcon} 
                    alt="Facebook Icon" 
                    className="w-32 h-32 text-gray-300"
                  />
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-medium text-gray-600">Facebook Post</h3>
                    <p className="text-sm text-gray-400 max-w-xs truncate">{props.title}</p>
                  </div>
                </div>
              </div>
            )}
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 p-1 bg-white text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 truncate rounded-b-md border-t border-gray-100 transition-colors"
            >
              View on Facebook
            </a>
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-400">
            Unsupported content type
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm h-[380px] flex flex-col">
        {/* Header - Kept exactly the same */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-md font-medium text-gray-700">
            {props.startIcon && props.startIcon}
            <span className="truncate">{props.title}</span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View
            </a>
            {/* Only show delete button if not in shared view and onDelete exists */}
            {!props.isSharedView && props.onDelete && (
              <button 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500"
              >
                <DeleteIcon size="md" />
              </button>
            )}
          </div>
        </div>

        {/* Content - Kept exactly the same */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>

        {/* Footer - Kept exactly the same */}
        <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
          <span>Created on: {date}</span>
          <span className="font-medium text-gray-700 capitalize">
            {props.type}
          </span>
        </div>
      </div>
    </div>
  );
};