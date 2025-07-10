import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, className = "", ...rest }, ref) => {
    return (
      <div>
        <input
          type="text"
          placeholder={placeholder}
          className={`px-4 py-2 border rounded m-2 ${className}`}
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
