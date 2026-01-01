"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, icon, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6b75]">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        ref={ref}
                        className={`
              w-full 
              px-4 py-3 
              bg-[#101014]
              border border-[#1e1e24]
              rounded-lg 
              text-[#e4e4e7] text-sm
              placeholder:text-[#4a4a54]
              transition-all duration-150
              focus:outline-none focus:border-[#7c5eb3] focus:ring-2 focus:ring-[#7c5eb3]/15
              hover:border-[#2a2a32]
              ${icon ? "pl-11" : ""}
              ${error ? "border-[#dc6b6b] focus:border-[#dc6b6b] focus:ring-[#dc6b6b]/15" : ""}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-[#dc6b6b]">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
