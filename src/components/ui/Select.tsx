import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-2.5 rounded-lg transition-all duration-200",
                        "bg-white/[0.03] border border-white/[0.08]",
                        "text-white",
                        "focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20",
                        "hover:bg-white/[0.05]",
                        error && "border-red-500/50 focus:border-red-500",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-zinc-900 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
