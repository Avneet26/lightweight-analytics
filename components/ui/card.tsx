import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated" | "glow";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = "default", children, ...props }, ref) => {
        const variants = {
            default: "bg-[#101014] border border-[#1e1e24]",
            elevated: "bg-[#14141a] border border-[#1e1e24]",
            glow: "bg-[#101014] border border-[#7c5eb3]/20 shadow-lg shadow-[#7c5eb3]/5",
        };

        return (
            <div
                ref={ref}
                className={`rounded-xl transition-all duration-150 hover:border-[#2a2a32] ${variants[variant]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`px-6 py-5 border-b border-[#1e1e24] ${className}`}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", ...props }, ref) => (
        <h3
            ref={ref}
            className={`text-lg font-semibold text-[#e4e4e7] ${className}`}
            {...props}
        />
    )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className = "", ...props }, ref) => (
        <p
            ref={ref}
            className={`text-sm text-[#71717a] mt-1 ${className}`}
            {...props}
        />
    )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div ref={ref} className={`p-6 ${className}`} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", ...props }, ref) => (
        <div
            ref={ref}
            className={`px-6 py-4 border-t border-[#1e1e24] ${className}`}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
