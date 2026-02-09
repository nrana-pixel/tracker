import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type = "text", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        "w-full px-4 py-2.5 rounded-lg transition-all duration-200",
                        "bg-white/[0.03] border border-white/[0.08]",
                        "text-white placeholder:text-zinc-600",
                        "focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20",
                        "hover:bg-white/[0.05]",
                        error && "border-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
