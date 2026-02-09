import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary:
                "bg-white text-black hover:bg-neutral-200 shadow-md font-semibold",
            secondary:
                "bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 backdrop-blur-sm",
            ghost: "hover:bg-white/[0.05] text-zinc-400 hover:text-white",
            danger:
                "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
