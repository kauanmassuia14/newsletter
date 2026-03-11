"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { PostCard } from "@/components/feed/post-card";
import { ThreadView } from "@/components/feed/thread-view";
import { PostCardSkeleton } from "@/components/ui/skeleton";
import { useEngagement } from "@/hooks/use-engagement";
import { CATEGORIES, type Category, type Post } from "@/lib/data";
import { createClient } from "@/lib/supabase";

export default function FeedPage() {
    const [category, setCategory] = useState<Category | "all">("all");
    const [selected, setSelected] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            let query = supabase.from('posts').select('*, author_profile:profiles!autor_da_noticia(display_name, avatar_url)').order('created_at', { ascending: false });

            if (category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) {
                console.error(error);
            } else {
                setPosts(data as any[]);
            }
            setLoading(false);
        }
        fetchPosts();
    }, [category]);

    const { liked, saved, toggleLike, toggleSave } = useEngagement();

    const handleCategorySwitch = (cat: Category | "all") => {
        if (cat === category) return;
        setCategory(cat);
    };

    const filtered = posts;

    if (selected) {
        return (
            <ThreadView
                post={selected}
                onBack={() => setSelected(null)}
                liked={liked.has(selected.id)}
                saved={saved.has(selected.id)}
                onLike={toggleLike}
                onSave={toggleSave}
            />
        );
    }

    return (
        <div className="min-h-screen font-[var(--font-body)]">
            <Navbar variant="feed" />

            {/* Category tabs */}
            <div className="sticky top-[57px] z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/80">
                <div className="mx-auto flex max-w-[620px]">
                    <button onClick={() => handleCategorySwitch("all")} className={`relative flex-1 py-3 text-center text-sm font-medium transition cursor-pointer ${category === "all" ? "text-brand dark:text-white" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[.02]"}`}>
                        Para Você
                        {category === "all" && <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-accent-400 dark:bg-accent-400" />}
                    </button>
                    {CATEGORIES.map(c => (
                        <button key={c.value} onClick={() => handleCategorySwitch(c.value)} className={`relative flex-1 py-3 text-center text-sm font-medium transition cursor-pointer ${category === c.value ? "text-brand dark:text-white" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[.02]"}`}>
                            {c.label}
                            {category === c.value && <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-accent-400 dark:bg-accent-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="mx-auto max-w-[620px]">
                {loading ? (
                    <>
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </>
                ) : (
                    <>
                        {filtered.map((post, i) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={i}
                                liked={liked.has(post.id)}
                                saved={saved.has(post.id)}
                                onLike={toggleLike}
                                onSave={toggleSave}
                                onClick={() => setSelected(post)}
                            />
                        ))}

                        {filtered.length === 0 && (
                            <div className="animate-fade-in py-20 text-center">
                                <p className="text-sm text-slate-400">Nenhuma notícia nesta categoria.</p>
                            </div>
                        )}

                        {filtered.length > 0 && (
                            <div className="border-t border-slate-100 py-10 text-center dark:border-white/5">
                                <p className="text-sm text-slate-300 dark:text-slate-600">Você está atualizado</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Bottom Nav */}
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/90 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/90 sm:hidden">
                <div className="flex items-center justify-around py-2">
                    {[
                        { label: "Feed", active: true, icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1z" /></svg> },
                        { label: "Buscar", active: false, icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
                        { label: "Notificações", active: false, icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
                    ].map((t, i) => (
                        <button key={i} className={`flex flex-col items-center gap-0.5 py-1 cursor-pointer ${t.active ? "text-accent-500 dark:text-accent-400" : "text-slate-400 dark:text-slate-500"}`}>
                            {t.icon}
                            <span className="text-[10px] font-medium">{t.label}</span>
                        </button>
                    ))}
                    <Link href="/login" className="flex flex-col items-center gap-0.5 py-1 text-slate-400 dark:text-slate-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
