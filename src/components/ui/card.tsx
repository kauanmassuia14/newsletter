import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

export function Card({ glass = false, className = "", children, ...props }: CardProps) {
    return (
        <div
            className={`rounded-2xl border transition-all duration-300
        ${glass
                    ? "border-white/[.06] bg-white/[.03] backdrop-blur-2xl"
                    : "border-slate-100 bg-white shadow-sm dark:border-white/[.06] dark:bg-white/[.025]"
                }
        ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
    return (
        <div className={`border-b border-slate-50 px-5 py-3.5 dark:border-white/5 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
    return <div className={`p-5 ${className}`}>{children}</div>;
}
