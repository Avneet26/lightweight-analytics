"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

        const baseStyles = `
      inline-flex items-center justify-center gap-2 
      font-medium rounded-lg 
      transition-all duration-150 
      focus:outline-none focus:ring-2 focus:ring-[#7c5eb3]/40 focus:ring-offset-2 focus:ring-offset-[#0c0c10]
      disabled:opacity-50 disabled:cursor-not-allowed
      whitespace-nowrap
    `;

        // Using softer, muted purples (#7c5eb3 main, #9b7ed9 lighter)
        const variants = {
            primary: `
        bg-gradient-to-r from-[#7c5eb3] to-[#8b6cc4]
        text-white 
        border border-[#7c5eb3]/50 
        hover:from-[#8b6cc4] hover:to-[#9b7ed9]
        hover:shadow-lg hover:shadow-[#7c5eb3]/15
      `,
            secondary: `
        bg-[#18181e]
        text-[#e4e4e7]
        border border-[#2a2a32]
        hover:bg-[#1e1e26] hover:border-[#3a3a44]
      `,
            ghost: `
        bg-transparent 
        text-[#a1a1aa] 
        hover:text-[#e4e4e7] hover:bg-[#18181e]
      `,
            danger: `
        bg-[#3d2020]
        text-[#f87171]
        border border-[#5c3030]
        hover:bg-[#4a2626]
      `,
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2.5 text-sm",
            lg: "px-6 py-3 text-sm",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
