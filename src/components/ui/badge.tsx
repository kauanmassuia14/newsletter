import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "info" | "danger";

const variants: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600 dark:bg-white/[.06] dark:text-slate-400",
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    info: "bg-sky-50 text-sky-600 dark:bg-accent-500/10 dark:text-accent-400",
    danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
};

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
