import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ContentType } from "./Sidebar";
import { Content } from "../../pages/Dashboard";

interface LayoutProps {
  children: React.ReactNode;
  activeFilter: ContentType | null;
  onFilterChange: (type: ContentType | null) => void;
  allContents: Content[];
  isSharedView?: boolean; // Added for shared view support
}

export const Layout = ({ 
  children, 
  activeFilter, 
  onFilterChange,
  allContents,
  isSharedView = false // Default to false
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        isOpen={isSidebarOpen}
        onToggleOpen={setIsSidebarOpen}
        allContents={allContents}
        isSharedView={isSharedView} // Pass to Sidebar
      />
      
      <main className={`flex-1 min-h-screen bg-gray-100 transition-all duration-300
        ${isSidebarOpen ? 'ml-72' : 'ml-0 md:ml-72'}`}>
        {children}
      </main>
    </div>
  );
};