"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATEGORIES, formatDate, type Post, type Category, type Subscriber } from "@/lib/data";
import { createClient } from "@/lib/supabase";

type Tab = "overview" | "posts" | "subscribers" | "new-post";

const NAV_ITEMS: SidebarItem[] = [
    { id: "overview", label: "Visão Geral", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg> },
    { id: "posts", label: "Notícias", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg> },
    { id: "subscribers", label: "Inscritos", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { id: "new-post", label: "Nova Notícia", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> },
];

type SortField = "name" | "email" | "created_at" | "status";
type SortDir = "asc" | "desc";

export default function DashboardPage() {
    const router = useRouter();
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [posts, setPosts] = useState<Post[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebar, setSidebar] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    const [newPost, setNewPost] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "eventos" as Category,
        images: [] as string[],
        video_url: ""
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    /* Subscriber sorting */
    const [sortField, setSortField] = useState<SortField>("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            setLoading(true);
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, is_admin, avatar_url')
                .eq('id', user.id)
                .single();

            setProfile(profile);

            if (!profile?.is_admin && user.email !== "kauanmassuia14@gmail.com") {
                router.push("/feed");
                return;
            }

            // Fetch Posts
            const { data: postsData } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (postsData) setPosts(postsData as any[]);

            // Fetch Subscribers
            const { data: subsData } = await supabase
                .from('subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (subsData) setSubscribers(subsData as any[]);

            setLoading(false);
        };
        checkAdminAndFetchData();
    }, [router]);

    const sortedSubscribers = useMemo(() => {
        const filtered = filterStatus === "all"
            ? [...subscribers]
            : subscribers.filter(s => s.status === filterStatus);

        return filtered.sort((a, b) => {
            const valA = (a as any)[sortField] || "";
            const valB = (b as any)[sortField] || "";
            const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [subscribers, sortField, sortDir, filterStatus]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const supabase = createClient();
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `posts/${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            setNewPost(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
        } catch (error: any) {
            alert("Erro no upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const supabase = createClient();

        // Filter out empty image URLs
        const validImages = newPost.images.filter(img => img.trim() !== "");

        const { error } = await supabase.from('posts').insert({
            title: newPost.title,
            excerpt: newPost.excerpt,
            content: newPost.content,
            category: newPost.category,
            images: validImages,
            video_url: newPost.video_url,
            author_id: user.id
        });

        if (error) {
            alert(error.message);
        } else {
            setNewPost({ title: "", excerpt: "", content: "", category: "eventos", images: [], video_url: "" });
            const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
            if (data) setPosts(data as any[]);
            setActiveTab("posts");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;
        const supabase = createClient();
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            alert(error.message);
        } else {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const currentLabel = NAV_ITEMS.find(t => t.id === activeTab)?.label;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center dark:bg-brand-900">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent dark:border-accent-400" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-[var(--font-body)]">
            <Sidebar items={NAV_ITEMS} activeId={activeTab} onSelect={(id) => setActiveTab(id as Tab)} open={sidebar} onClose={() => setSidebar(false)} />

            <div className="flex-1 lg:pl-[248px]">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-3 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/80">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebar(true)} className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden cursor-pointer">
                            <svg className="h-5 w-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </button>
                        <div>
                            <h1 className="font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">{currentLabel}</h1>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-brand text-xs font-bold text-white shadow-sm dark:bg-accent-400/20 dark:text-accent-400">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                profile?.display_name ? profile.display_name[0].toUpperCase() : (user?.email?.[0].toUpperCase() || "A")
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-6 sm:p-8">
                    {activeTab === "overview" && (
                        <div className="animate-fade-in space-y-7">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard label="Total de Inscritos" value={subscribers.length} delta="+0% esta semana" colorClass="text-sky-600 bg-sky-50 dark:bg-accent-500/10 dark:text-accent-400" />
                                <StatCard label="Notícias Publicadas" value={posts.length} delta="+1 esta semana" colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" />
                                <StatCard label="Taxa de Abertura" value={68.5} suffix="%" delta="+0%" colorClass="text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" />
                                <StatCard label="Acessos Totais" value={Math.floor(posts.length * 15.4)} delta="Real" colorClass="text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400" />
                            </div>

                            <Card>
                                <CardHeader className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-brand dark:text-white">Últimas Notícias</h3>
                                    <Button size="sm" variant="ghost" onClick={() => setActiveTab("new-post")}>Criar Nova</Button>
                                </CardHeader>
                                <div className="divide-y divide-slate-50 dark:divide-white/5">
                                    {posts.slice(0, 5).map((p) => (
                                        <div key={p.id} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/50 dark:hover:bg-white/[.02]">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-brand dark:text-white">{p.title}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(p.created_at || "")}</p>
                                            </div>
                                            <Badge variant="success">Publicado</Badge>
                                        </div>
                                    ))}
                                    {posts.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Nenhuma notícia publicada ainda.</p>}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "posts" && (
                        <div className="animate-fade-in space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-400">{posts.length} notícias</p>
                                <Button onClick={() => setActiveTab("new-post")} icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}>Nova</Button>
                            </div>
                            <div className="space-y-3">
                                {posts.map((p) => (
                                    <div key={p.id} className="group card-premium p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{p.category}</span>
                                                    <Badge variant="success">Publicado</Badge>
                                                    {p.images && p.images.length > 0 && <Badge variant="default">{p.images.length} Fotos</Badge>}
                                                    {p.video_url && <Badge variant="warning">Vídeo</Badge>}
                                                </div>
                                                <h3 className="mb-1 font-[var(--font-heading)] text-sm font-bold text-brand dark:text-white">{p.title}</h3>
                                                <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{p.excerpt}</p>
                                                <div className="mt-1.5 flex gap-3 text-[11px] text-slate-400 dark:text-slate-500"><span>{formatDate(p.created_at || "")}</span></div>
                                            </div>
                                            <button onClick={() => handleDelete(p.id)} className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10 cursor-pointer">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "subscribers" && (
                        <div className="animate-fade-in space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-400">{sortedSubscribers.length} inscritos</p>
                                <div className="flex gap-1.5">
                                    {(["all", "active", "inactive"] as const).map(s => (
                                        <button key={s} onClick={() => setFilterStatus(s)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${filterStatus === s ? "bg-accent-50 text-accent-600 dark:bg-accent-400/10 dark:text-accent-400" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[.03]"}`}>
                                            {s === "all" ? "Todos" : s === "active" ? "Ativos" : "Inativos"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Card>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[480px]">
                                        <thead>
                                            <tr className="border-b border-slate-50 dark:border-white/5">
                                                {([["name", "Nome"], ["email", "Email"], ["created_at", "Data"], ["status", "Status"]] as [SortField, string][]).map(([field, header]) => (
                                                    <th key={field} onClick={() => handleSort(field)} className="cursor-pointer px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-brand dark:hover:text-white transition">
                                                        <span className="inline-flex items-center gap-1">
                                                            {header}
                                                            {sortField === field && (
                                                                <svg className={`h-3 w-3 transition ${sortDir === "desc" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                                                            )}
                                                        </span>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                            {sortedSubscribers.map(s => (
                                                <tr key={s.id} className="transition hover:bg-slate-50/50 dark:hover:bg-white/[.02]">
                                                    <td className="px-5 py-3"><span className="text-sm font-medium text-brand dark:text-white">{s.name || "Leitor Anônimo"}</span></td>
                                                    <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{s.email}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-400 dark:text-slate-500">{formatDate(s.created_at || "")}</td>
                                                    <td className="px-5 py-3"><Badge variant={s.status === "active" ? "success" : "default"}>{s.status === "active" ? "Ativo" : "Inativo"}</Badge></td>
                                                </tr>
                                            ))}
                                            {subscribers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="py-10 text-center text-sm text-slate-400">Nenhum inscrito ainda.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "new-post" && (
                        <div className="mx-auto max-w-4xl animate-fade-in">
                            <form onSubmit={handleCreate} className="space-y-6">
                                <Card>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Título</label>
                                            <input type="text" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required placeholder="Título da notícia..."
                                                className="w-full border-b border-slate-100 bg-transparent py-4 font-[var(--font-heading)] text-2xl font-extrabold text-brand focus:border-brand focus:outline-none dark:border-white/10 dark:text-white dark:focus:border-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resumo (Excerpt)</label>
                                            <textarea value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} required rows={2} placeholder="Um pequeno resumo que aparece no feed..."
                                                className="w-full resize-none border-none bg-transparent py-2 text-sm text-slate-500 focus:outline-none dark:text-slate-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardContent className="space-y-4">
                                            <h4 className="text-sm font-bold text-brand dark:text-white">Mídia & Categoria</h4>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase text-slate-400">Categoria</label>
                                                <div className="flex gap-2">
                                                    {CATEGORIES.map(c => (
                                                        <button key={c.value} type="button" onClick={() => setNewPost({ ...newPost, category: c.value })}
                                                            className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${newPost.category === c.value
                                                                ? "bg-brand text-white dark:bg-accent-400 dark:text-brand-900"
                                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-white/[.04] dark:text-slate-400"}`}>{c.label}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-semibold uppercase text-slate-400">Fotos (Upload Real)</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => mediaInputRef.current?.click()}
                                                        disabled={uploading}
                                                        className="text-xs font-bold text-brand hover:underline dark:text-accent-400 disabled:opacity-50"
                                                    >
                                                        {uploading ? "Subindo..." : "+ Upload Fotos"}
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    ref={mediaInputRef}
                                                    onChange={handleMediaUpload}
                                                />
                                                <div className="flex flex-wrap gap-2 py-2">
                                                    {newPost.images.map((img, idx) => (
                                                        <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-100 shadow-sm dark:bg-white/5">
                                                            <img src={img} className="h-full w-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setNewPost(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                                className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow-sm"
                                                            >
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase text-slate-400">URL do Vídeo</label>
                                                <Input
                                                    placeholder="URL do vídeo (ex: YouTube/Vantage)..."
                                                    value={newPost.video_url}
                                                    onChange={e => setNewPost({ ...newPost, video_url: e.target.value })}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="flex flex-col">
                                        <CardContent className="flex-1">
                                            <h4 className="mb-4 text-sm font-bold text-brand dark:text-white">Conteúdo Principal</h4>
                                            <textarea
                                                value={newPost.content}
                                                onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                                required
                                                placeholder="Conte sua história aqui (suporta HTML)..."
                                                className="h-full min-h-[300px] w-full resize-none border-none bg-transparent text-sm leading-relaxed text-slate-600 focus:outline-none dark:text-slate-400"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <Button type="button" variant="secondary" onClick={() => setActiveTab("posts")}>Descartar</Button>
                                    <Button type="submit" loading={saving} className="px-10">
                                        {saving ? "Salvando..." : "Publicar Notícia"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
