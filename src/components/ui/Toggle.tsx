"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={cn(
                        "w-11 h-6 rounded-full transition-all duration-300 border border-white/10",
                        checked
                            ? "bg-white"
                            : "bg-white/[0.05]"
                    )}
                />
                <div
                    className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300",
                        checked ? "bg-black" : "bg-zinc-400",
                        checked && "translate-x-5"
                    )}
                />
            </div>
            {label && <span className="text-sm text-gray-300">{label}</span>}
        </label>
    );
}
