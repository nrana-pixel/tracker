"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/Icons";

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
}

export function StarRating({
    value,
    onChange,
    readonly = false,
    size = "md",
}: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    const displayValue = hovered !== null ? hovered : value;

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    className={cn(
                        "transition-all duration-150 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/20",
                        !readonly && "cursor-pointer hover:scale-110",
                        readonly && "cursor-default"
                    )}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onChange?.(star)}
                >
                    <Icons.Star
                        className={cn(
                            sizeClasses[size],
                            "transition-colors duration-150",
                            star <= displayValue
                                ? "fill-white text-white"
                                : "text-zinc-700 fill-transparent"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
