import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
}

const variants: Record<Variant, string> = {
    primary:
        "bg-brand text-white shadow-sm hover:bg-brand-700 dark:bg-accent-400 dark:text-brand-900 dark:hover:bg-accent-300",
    secondary:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-200 dark:hover:bg-white/[.07]",
    ghost:
        "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[.06] dark:hover:text-white",
    danger:
        "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500",
};

const sizes: Record<Size, string> = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-7 py-3.5 text-sm gap-2.5 rounded-xl",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}
