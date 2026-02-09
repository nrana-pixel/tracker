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

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-zinc-400">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-sm font-semibold text-white">{value}/{max}</span>
                    )}
                </div>
            )}
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className="absolute h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange?.(Number(e.target.value))}
                className="absolute w-full h-2 opacity-0 cursor-pointer -mt-2"
            />
            <div className="flex justify-between mt-2">
                {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange?.(n)}
                        className={cn(
                            "w-6 h-6 rounded-full text-xs font-medium transition-all duration-200",
                            value === n
                                ? "bg-white text-black"
                                : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}
