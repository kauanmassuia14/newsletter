"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedIcon, HeartIcon, BookmarkIcon, ShareIcon, CommentIcon } from "@/components/feed/post-card";
import { formatDateFull, type Post } from "@/lib/data";
import { createClient } from "@/lib/supabase";

interface ThreadViewProps {
    post: Post;
    onBack: () => void;
    liked: boolean;
    saved: boolean;
    onLike: (id: string, e: React.MouseEvent) => void;
    onSave: (id: string, e: React.MouseEvent) => void;
}

export function ThreadView({ post, onBack, liked, saved, onLike, onSave }: ThreadViewProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select('*, profiles(email, avatar_url, display_name)')
                .eq('post_id', post.id)
                .order('created_at', { ascending: true });
            if (data) setComments(data);
        };
        fetchComments();
    }, [post.id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Faça login para comentar.");
            setIsSubmitting(false);
            return;
        }

        const { data, error } = await supabase
            .from('comments')
            .insert([{ content: newComment, post_id: post.id, user_id: user.id }])
            .select('*, profiles(email, avatar_url, display_name)')
            .single();

        if (error) {
            alert(error.message);
        } else {
            setComments([...comments, data]);
            setNewComment("");
        }
        setIsSubmitting(false);
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen animate-fade-in font-[var(--font-body)]">
            <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/80">
                <div className="mx-auto flex max-w-[620px] items-center gap-5 px-4 py-3">
                    <button onClick={onBack} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 cursor-pointer">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </button>
                    <h1 className="font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Post</h1>
                </div>
            </nav>

            <div className="mx-auto max-w-[620px]">
                <div className="px-4 pt-4">
                    <div className="mb-3 flex items-center gap-3">
                        <Avatar
                            name={post.author_profile?.display_name || post.author || "Kauan"}
                            src={post.author_profile?.avatar_url}
                        />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[15px] font-bold text-brand dark:text-white">
                                    {post.author_profile?.display_name || post.author || "admin"}
                                </span>
                                <VerifiedIcon />
                            </div>
                            <span className="text-[13px] text-slate-400 dark:text-slate-500">@connectstory</span>
                        </div>
                    </div>
                </div>

                <div className="px-4 pt-2">
                    <h2 className="font-[var(--font-heading)] text-xl font-extrabold leading-snug text-brand dark:text-white sm:text-2xl">{post.title}</h2>
                </div>

                {/* Multimedia Support */}
                <div className="px-4 pt-4">
                    {/* Video */}
                    {post.video_url && (
                        <div className="mb-4 aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
                            {getYoutubeId(post.video_url) ? (
                                <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${getYoutubeId(post.video_url)}`} allowFullScreen />
                            ) : (
                                <video src={post.video_url} controls className="h-full w-full" />
                            )}
                        </div>
                    )}

                    {/* Image Carousel */}
                    {post.images && post.images.length > 0 && (
                        <div className="group relative mb-4 overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/[.04]">
                            <img src={post.images[activeImage]} alt="" className="aspect-[4/3] w-full object-cover transition duration-500" />

                            {post.images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : post.images!.length - 1))}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                    </button>
                                    <button onClick={() => setActiveImage(prev => (prev < post.images!.length - 1 ? prev + 1 : 0))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                                        {post.images.map((_, i) => (
                                            <div key={i} className={`h-1.5 w-1.5 rounded-full transition-all ${i === activeImage ? "w-4 bg-white" : "bg-white/40"}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-4 pt-2">
                    <div className="prose-brand prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                <div className="mt-6 border-b border-slate-100 px-4 pb-4 dark:border-white/5">
                    <p className="text-[13px] text-slate-400 dark:text-slate-500">
                        {formatDateFull(post.created_at || post.createdAt || "")} · <span className="font-medium text-brand dark:text-accent-300">{post.readTime || "5 min"} de leitura</span>
                    </p>
                </div>

                <div className="flex gap-5 border-b border-slate-100 px-4 py-3 dark:border-white/5">
                    <span className="text-[13px] text-slate-400 dark:text-slate-500"><strong className="font-bold text-brand dark:text-white">{comments.length}</strong> Comentários</span>
                    <span className="text-[13px] text-slate-400 dark:text-slate-500"><strong className="font-bold text-brand dark:text-white">28</strong> Curtidas</span>
                </div>

                <div className="flex items-center justify-around border-b border-slate-100 py-2 dark:border-white/5">
                    <button className="rounded-full p-2.5 text-slate-400 transition hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-accent-500/10 cursor-pointer"><CommentIcon /></button>
                    <button onClick={(e) => onLike(post.id, e)} className={`rounded-full p-2.5 transition cursor-pointer ${liked ? "text-rose-500" : "text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"}`}><HeartIcon filled={liked} /></button>
                    <button onClick={(e) => onSave(post.id, e)} className={`rounded-full p-2.5 transition cursor-pointer ${saved ? "text-accent-500 dark:text-accent-300" : "text-slate-400 hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5"}`}><BookmarkIcon filled={saved} /></button>
                    <button className="rounded-full p-2.5 text-slate-400 transition hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-white/5 cursor-pointer"><ShareIcon /></button>
                </div>

                {/* Comment Input */}
                <div className="border-b border-slate-100 p-4 dark:border-white/5">
                    <div className="flex gap-3">
                        <Avatar name="Você" />
                        <div className="flex-1">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Poste seu comentário..."
                                className="w-full resize-none border-none bg-transparent p-0 text-[15px] text-brand placeholder-slate-400 focus:ring-0 dark:text-white" rows={2} />
                            <div className="mt-2 flex justify-end">
                                <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting} size="sm">Responder</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {comments.map((c: any) => (
                        <div key={c.id} className="p-4 flex gap-3 animate-fade-in text-sm border-t border-slate-100 dark:border-white/5">
                            <Avatar
                                name={c.profiles?.display_name || c.profiles?.email || 'User'}
                                src={c.profiles?.avatar_url}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-brand dark:text-white truncate">
                                        {c.profiles?.display_name || c.profiles?.email?.split('@')[0]}
                                    </span>
                                    <span className="text-[11px] text-slate-400">{formatDateFull(c.created_at)}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{c.content}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="py-10 text-center text-xs text-slate-400">Seja o primeiro a comentar!</p>}
                </div>

                <div className="m-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center dark:border-white/[.06] dark:bg-white/[.02]">
                    <p className="mb-1 font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Gostou deste conteúdo?</p>
                    <p className="mb-4 text-sm text-slate-400">Receba posts como este diretamente no seu email.</p>
                    <Link href="/">
                        <Button className="w-full sm:w-auto">Inscrever-se Agora</Button>
                    </Link>
                </div>
                <div className="h-16 sm:h-4" />
            </div>
        </div>
    );
}
