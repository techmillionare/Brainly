import { ReactElement } from "react";

interface ItemProps {
  icon: ReactElement;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean; // Added disabled prop for shared view
}

export const SidebarItems = ({ 
  icon, 
  text, 
  isActive = false, 
  onClick,
  disabled = false // Default to false
}: ItemProps) => {
  return (
    <div
      className={`flex items-center py-3 px-4 mx-2 rounded-lg transition-all duration-200 cursor-pointer
      ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-gray-100 text-gray-700"
      }
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="w-6 h-6 mr-3 flex items-center justify-center">{icon}</div>
      <span className="whitespace-nowrap text-sm font-medium">{text}</span>
      {isActive && (
        <span className="ml-auto text-xs text-blue-500">●</span>
      )}
    </div>
  );
};