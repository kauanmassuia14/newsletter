"use client";

import { useCounterAnimation } from "@/hooks/use-counter-animation";

interface StatCardProps {
    label: string;
    value: number;
    suffix?: string;
    delta: string;
    colorClass: string;
}

export function StatCard({ label, value, suffix = "", delta, colorClass }: StatCardProps) {
    const animated = useCounterAnimation(value);

    return (
        <div className="card-premium p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${colorClass}`}>
                    {delta}
                </span>
            </div>
            <p className="font-[var(--font-heading)] text-3xl font-extrabold text-brand dark:text-white">
                {animated.toLocaleString()}{suffix}
            </p>
        </div>
    );
}
