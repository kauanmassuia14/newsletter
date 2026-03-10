interface SkeletonProps {
    className?: string;
    lines?: number;
}

export function Skeleton({ className = "", lines = 1 }: SkeletonProps) {
    if (lines > 1) {
        return (
            <div className="space-y-2.5">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-lg bg-slate-100 animate-shimmer skeleton-shimmer dark:bg-white/[.06] ${i === lines - 1 ? "w-3/4" : "w-full"} h-3.5`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={`rounded-lg bg-slate-100 animate-shimmer skeleton-shimmer dark:bg-white/[.06] ${className}`} />
    );
}

export function PostCardSkeleton() {
    return (
        <div className="flex gap-3 border-b border-slate-100 px-4 py-4 dark:border-white/5">
            <Skeleton className="h-10 w-10 shrink-0 !rounded-full" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-48" />
                <Skeleton lines={2} />
                <Skeleton className="h-28 w-full !rounded-xl" />
                <div className="flex gap-8">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-10" />
                </div>
            </div>
        </div>
    );
}
