"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    label?: string;
    showValue?: boolean;
}

export function Slider({
    value,
    onChange,
    min = 1,
    max = 5,
    label,
    showValue = true,
}: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    const getColor = () => {
        if (value <= 2) return "from-red-500 to-red-600";
        if (value <= 3) return "from-yellow-500 to-yellow-600";
        return "from-green-500 to-green-600";
    };

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-gray-300">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-sm font-semibold text-white">{value}/{max}</span>
                    )}
                </div>
            )}
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "absolute h-full rounded-full bg-gradient-to-r transition-all duration-300",
                        getColor()
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
                className="absolute w-full h-3 opacity-0 cursor-pointer"
                style={{ marginTop: "-12px" }}
            />
            <div className="flex justify-between mt-1">
                {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange?.(n)}
                        className={cn(
                            "w-6 h-6 rounded-full text-xs font-medium transition-all duration-200",
                            value === n
                                ? "bg-white/20 text-white"
                                : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}
