"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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

    const sizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
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
                        sizes[size],
                        "transition-all duration-150",
                        !readonly && "cursor-pointer hover:scale-110",
                        readonly && "cursor-default"
                    )}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onChange?.(star)}
                >
                    <span
                        className={cn(
                            "transition-all duration-150",
                            star <= displayValue ? "opacity-100" : "opacity-30"
                        )}
                    >
                        ⭐
                    </span>
                </button>
            ))}
        </div>
    );
}
