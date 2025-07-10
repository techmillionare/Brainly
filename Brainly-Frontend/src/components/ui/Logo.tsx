// src/components/Logo.tsx
import { LogoIcon } from "../../icons/LogoIcon";

export const Logo = () => {
  return (
    <div className="flex items-center cursor-pointer" onClick={() => window.location.href = "/"}>
        <LogoIcon />
      <span className="ml-2 text-2xl font-bold">Second Brain</span>
    </div>
  );
};