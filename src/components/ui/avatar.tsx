interface AvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-11 w-11 text-sm",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full
        bg-brand font-bold text-white
        dark:bg-accent-400/20 dark:text-accent-300
        ${sizeMap[size]} ${className}`}
        >
            {name[0]?.toUpperCase()}
        </div>
    );
}
