"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedIcon, HeartIcon, BookmarkIcon, ShareIcon, CommentIcon, RetweetIcon } from "@/components/feed/post-card";
import { formatDateFull, type Post } from "@/lib/data";

interface ThreadViewProps {
    post: Post;
    onBack: () => void;
    liked: boolean;
    saved: boolean;
    onLike: (id: string, e: React.MouseEvent) => void;
    onSave: (id: string, e: React.MouseEvent) => void;
}

export function ThreadView({ post, onBack, liked, saved, onLike, onSave }: ThreadViewProps) {
    return (
        <div className="min-h-screen animate-fade-in font-[var(--font-body)]">
            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/80">
                <div className="mx-auto flex max-w-[620px] items-center gap-5 px-4 py-3">
                    <button onClick={onBack} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 cursor-pointer">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </button>
                    <h1 className="font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Post</h1>
                </div>
            </nav>

            <div className="mx-auto max-w-[620px]">
                {/* Header */}
                <div className="px-4 pt-4">
                    <div className="mb-3 flex items-center gap-3">
                        <Avatar name={post.author} size="lg" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[15px] font-bold text-brand dark:text-white">{post.author}</span>
                                <VerifiedIcon />
                            </div>
                            <span className="text-[13px] text-slate-400 dark:text-slate-500">@connectstory</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="px-4 pt-2">
                    <h2 className="font-[var(--font-heading)] text-xl font-extrabold leading-snug text-brand dark:text-white sm:text-2xl">{post.title}</h2>
                </div>

                {/* Content */}
                <div className="px-4 pt-4">
                    <div className="prose-brand text-[15px]" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Timestamp */}
                <div className="mt-4 border-b border-slate-100 px-4 pb-4 dark:border-white/5">
                    <p className="text-[13px] text-slate-400 dark:text-slate-500">
                        {formatDateFull(post.createdAt)} · <span className="font-medium text-brand dark:text-accent-300">{post.readTime}</span>
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-5 border-b border-slate-100 px-4 py-3 dark:border-white/5">
                    <span className="text-[13px] text-slate-400 dark:text-slate-500"><strong className="font-bold text-brand dark:text-white">4</strong> Reposts</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500"><strong className="font-bold text-brand dark:text-white">28</strong> Curtidas</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500"><strong className="font-bold text-brand dark:text-white">15</strong> Salvos</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around border-b border-slate-100 py-2 dark:border-white/5">
                    <ThreadAction icon={<CommentIcon />} hoverClass="hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-accent-500/10" />
                    <ThreadAction icon={<RetweetIcon />} hoverClass="hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-500/10" />
                    <button onClick={(e) => onLike(post.id, e)} className={`rounded-full p-2.5 transition cursor-pointer ${liked ? "text-rose-500" : "text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"}`}>
                        <HeartIcon filled={liked} />
                    </button>
                    <button onClick={(e) => onSave(post.id, e)} className={`rounded-full p-2.5 transition cursor-pointer ${saved ? "text-accent-500 dark:text-accent-300" : "text-slate-400 hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5"}`}>
                        <BookmarkIcon filled={saved} />
                    </button>
                    <ThreadAction icon={<ShareIcon />} hoverClass="hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5" />
                </div>

                {/* Subscribe CTA */}
                <div className="m-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 text-center dark:border-white/[.06] dark:bg-white/[.02]">
                    <p className="mb-1 font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Gostou deste conteúdo?</p>
                    <p className="mb-4 text-sm text-slate-400">Receba posts como este diretamente no seu email.</p>
                    <Link href="/">
                        <Button icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>}>
                            Inscrever-se
                        </Button>
                    </Link>
                </div>

                <div className="h-16 sm:h-4" />
            </div>
        </div>
    );
}

function ThreadAction({ icon, hoverClass }: { icon: React.ReactNode; hoverClass: string }) {
    return (
        <button className={`rounded-full p-2.5 text-slate-400 transition cursor-pointer ${hoverClass}`}>
            {icon}
        </button>
    );
}
