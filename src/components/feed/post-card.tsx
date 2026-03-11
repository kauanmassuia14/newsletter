"use client";

import { Avatar } from "@/components/ui/avatar";
import { getCategoryStyle, formatDate, type Post } from "@/lib/data";

interface PostCardProps {
    post: Post;
    index: number;
    liked: boolean;
    saved: boolean;
    onLike: (id: string, e: React.MouseEvent) => void;
    onSave: (id: string, e: React.MouseEvent) => void;
    onClick: () => void;
}

export function PostCard({ post, index, liked, saved, onLike, onSave, onClick }: PostCardProps) {
    const style = getCategoryStyle(post.category);

    return (
        <article
            onClick={onClick}
            className="cursor-pointer border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[.02] animate-fade-in"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex gap-3">
                <Avatar
                    name={post.author_profile?.display_name || post.author || "Admin"}
                    src={post.author_profile?.avatar_url}
                />

                <div className="min-w-0 flex-1">
                    {/* Author */}
                    <div className="mb-0.5 flex items-center gap-1.5">
                        <span className="text-[15px] font-bold text-brand dark:text-white">
                            {post.author_profile?.display_name || post.author || "Admin"}
                        </span>
                        <VerifiedIcon />
                        <span className="text-[13px] text-slate-400 dark:text-slate-500">· {formatDate(post.created_at || post.createdAt || "")}</span>
                    </div>

                    {/* Category */}
                    <span className={`mb-1.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}>
                        {post.category}{post.featured ? " · Destaque" : ""}
                    </span>

                    {/* Title + Excerpt */}
                    <h3 className="mb-1 font-[var(--font-heading)] text-[15px] font-bold leading-snug text-brand dark:text-white">{post.title}</h3>
                    <p className="mb-3 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">{post.excerpt}</p>

                    {/* Preview Card */}
                    <div className={`mb-3 overflow-hidden rounded-xl border border-slate-100 dark:border-white/5 ${style.card}`}>
                        <div className="relative flex h-40 items-center justify-center sm:h-48 overflow-hidden bg-slate-100 dark:bg-brand-800">
                            {post.images && post.images.length > 0 ? (
                                <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            ) : (
                                <svg className="h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                </svg>
                            )}

                            {post.video_url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand shadow-xl dark:bg-accent-400 dark:text-brand-900">
                                        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.147l10 6.853-10 6.853v-13.706z" /></svg>
                                    </div>
                                </div>
                            )}

                            {post.images && post.images.length > 1 && (
                                <div className="absolute top-3 right-3 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                    1 / {post.images.length}
                                </div>
                            )}
                        </div>
                        <div className="border-t border-slate-100 bg-white/80 px-3.5 py-2 dark:border-white/5 dark:bg-brand-900/60">
                            <p className="truncate text-xs font-medium text-brand dark:text-white">{post.title}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{post.readTime || "5 min"} de leitura</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex max-w-[380px] items-center justify-between">
                        <ActionBtn icon={<CommentIcon />} count={12} hoverClass="hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-accent-500/10" onClick={stopPropagation} />
                        <ActionBtn
                            icon={<DownloadIcon />}
                            hoverClass="hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-500/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPDF(post);
                            }}
                        />
                        <ActionBtn
                            icon={<HeartIcon filled={liked} />}
                            count={28}
                            active={liked}
                            activeClass="text-rose-500"
                            hoverClass="hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                            onClick={(e) => onLike(post.id, e)}
                        />
                        <ActionBtn
                            icon={<BookmarkIcon filled={saved} />}
                            active={saved}
                            activeClass="text-accent-500 dark:text-accent-300"
                            hoverClass="hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5"
                            onClick={(e) => onSave(post.id, e)}
                        />
                        <ActionBtn icon={<ShareIcon />} hoverClass="hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5" onClick={stopPropagation} />
                    </div>
                </div>
            </div>
        </article>
    );
}

const handleDownloadPDF = async (post: Post) => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(post.title, 10, 20);

    doc.setFontSize(12);
    doc.text(`Por: ${post.author || "Admin"} | ${formatDate(post.created_at || post.createdAt || "")}`, 10, 30);

    doc.setFontSize(14);
    const splitContent = doc.splitTextToSize(post.content.replace(/<[^>]*>?/gm, ''), 180);
    doc.text(splitContent, 10, 45);

    doc.save(`${post.title.substring(0, 20)}.pdf`);
};

function DownloadIcon() {
    return <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
}

/* ── Sub-components & Icons ── */

function stopPropagation(e: React.MouseEvent) { e.stopPropagation(); }

interface ActionBtnProps {
    icon: React.ReactNode;
    count?: number;
    active?: boolean;
    activeClass?: string;
    hoverClass: string;
    onClick: (e: React.MouseEvent) => void;
}

function ActionBtn({ icon, count, active, activeClass, hoverClass, onClick }: ActionBtnProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1 rounded-full p-1.5 transition cursor-pointer
        ${active ? activeClass : `text-slate-400 ${hoverClass}`}`}
        >
            {icon}
            {count !== undefined && <span className="text-[12px]">{count}</span>}
        </button>
    );
}

function VerifiedIcon() {
    return (
        <svg className="h-4 w-4 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
        </svg>
    );
}

function CommentIcon() {
    return <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>;
}
function RetweetIcon() {
    return <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>;
}
function HeartIcon({ filled }: { filled: boolean }) {
    return <svg className="h-[17px] w-[17px]" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
}
function BookmarkIcon({ filled }: { filled: boolean }) {
    return <svg className="h-[17px] w-[17px]" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>;
}
function ShareIcon() {
    return <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
}

export { VerifiedIcon, HeartIcon, BookmarkIcon, ShareIcon, CommentIcon, RetweetIcon };
