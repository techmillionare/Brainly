import { ReactElement } from 'react';
import { Spinner } from './SpinnerProps'; // Assuming you have a Spinner component

interface ButtonProps {
    variant: "primary" | "secondary" | "danger";
    size: "sm" | "md" | "lg";
    text: string;
    StartIcon?: ReactElement;
    EndIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const variantStyle = {
    "primary": "bg-purple-600 hover:bg-purple-700 text-white",
    "secondary": "bg-purple-100 hover:bg-purple-200 text-purple-700",
    "danger": "bg-red-600 hover:bg-red-700 text-white"
};

const sizeStyle = {
    "sm": "py-1.5 px-3 text-sm",
    "md": "py-2.5 px-5 text-base",
    "lg": "py-3.5 px-7 text-lg"
};

const baseStyle = "rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

export const Button = ({
    variant = "primary",
    size = "md",
    text,
    StartIcon,
    EndIcon,
    onClick,
    fullWidth = false,
    loading = false,
    disabled = false,
    className = ""
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${variantStyle[variant]}
                ${sizeStyle[size]}
                ${baseStyle}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
            aria-busy={loading}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner size={size} className="mr-2" />
                    <span>Processing...</span>
                </div>
            ) : (
                <div className="flex items-center">
                    {StartIcon && <span className={`${text ? 'mr-2' : ''}`}>{StartIcon}</span>}
                    {text}
                    {EndIcon && <span className={`${text ? 'ml-2' : ''}`}>{EndIcon}</span>}
                </div>
            )}
        </button>
    );
};