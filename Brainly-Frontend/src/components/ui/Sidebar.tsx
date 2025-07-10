import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarItems } from "./SidebarItems";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YouTubeIcon } from "../../icons/YoutubeIcon";
import { Logo } from "./Logo";
import NotionIcon from "../../icons/NotionIcon";
import InstagramIcon from "../../icons/InstagramIcon";
import FacebookIcon from "../../icons/FacebookIcon";
import { Content } from "../../pages/Dashboard";
import { useNavigate } from "react-router-dom";

export type ContentType = 'Youtube' | 'Twitter' | 'Notion' | 'Instagram' | 'Facebook';

interface SidebarProps {
  onFilterChange: (type: ContentType | null) => void;
  activeFilter: ContentType | null;
  isOpen: boolean;
  onToggleOpen: (isOpen: boolean) => void;
  allContents: Content[];
  isSharedView?: boolean; // Added this prop
}

export const Sidebar = ({ 
  onFilterChange, 
  activeFilter,
  isOpen,
  onToggleOpen,
  allContents,
  isSharedView = false // Default to false
}: SidebarProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getContentCount = (type: ContentType | null) => {
    if (!type) return allContents.length;
    return allContents.filter(content => content.type === type).length;
  };

  const handleFilterClick = (type: ContentType | null) => {
    onFilterChange(type);
    onToggleOpen(false);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <>
      {/* Mobile menu button */}
      {!isSharedView && ( // Only show mobile menu button in non-shared view
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => onToggleOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-screen bg-white border-r w-72 transition-all duration-300 ease-in-out z-40 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex-1">
          <div className="p-4 border-b">
            <Logo />
          </div>
          <div className="pt-2 pl-2">
            <SidebarItems 
              text={`All Content (${getContentCount(null)})`}
              icon={<div className="w-6 h-6 flex items-center justify-center">📄</div>}
              isActive={activeFilter === null}
              onClick={() => handleFilterClick(null)}
            />
            <SidebarItems 
              text={`Twitter (${getContentCount('Twitter')})`}
              icon={<TwitterIcon />} 
              isActive={activeFilter === 'Twitter'}
              onClick={() => handleFilterClick('Twitter')}
            />
            <SidebarItems 
              text={`YouTube (${getContentCount('Youtube')})`}
              icon={<YouTubeIcon />} 
              isActive={activeFilter === 'Youtube'}
              onClick={() => handleFilterClick('Youtube')}
            />
            <SidebarItems 
              text={`Notion (${getContentCount('Notion')})`}
              icon={<NotionIcon/>} 
              isActive={activeFilter === 'Notion'}
              onClick={() => handleFilterClick('Notion')}
            />
            <SidebarItems 
              text={`Instagram (${getContentCount('Instagram')})`}
              icon={<InstagramIcon/>} 
              isActive={activeFilter === 'Instagram'}
              onClick={() => handleFilterClick('Instagram')}
            />
            <SidebarItems 
              text={`Facebook (${getContentCount('Facebook')})`}
              icon={<FacebookIcon/>} 
              isActive={activeFilter === 'Facebook'}
              onClick={() => handleFilterClick('Facebook')}
            />
          </div>
        </div>

        {/* Only show logout button in non-shared view */}
        {!isSharedView && (
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`
                w-full py-2 px-4 rounded-md 
                text-red-600 bg-red-50  hover:bg-red-100 
                transition-colors duration-200
                font-medium
                ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && !isSharedView && ( // Only show overlay in non-shared view
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => onToggleOpen(false)}
        />
      )}
    </>
  );
};