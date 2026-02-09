import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            default:
                "bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/50 text-white",
            glass:
                "bg-white/[0.03] border border-white/[0.08] backdrop-blur-3xl text-white",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl p-6 transition-all duration-300",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("mb-4", className)} {...props}>
                {children}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-lg font-semibold text-white", className)}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = "CardTitle";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
