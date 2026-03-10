"use client";

import { useState, useMemo } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar, type SidebarItem } from "@/components/layout/sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { mockPosts, mockSubscribers, mockStats, CATEGORIES, formatDate, type Post, type Category } from "@/lib/data";

type Tab = "overview" | "posts" | "subscribers" | "new-post";

const NAV_ITEMS: SidebarItem[] = [
    { id: "overview", label: "Visão Geral", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg> },
    { id: "posts", label: "Notícias", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg> },
    { id: "subscribers", label: "Inscritos", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { id: "new-post", label: "Nova Notícia", icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> },
];

type SortField = "name" | "email" | "createdAt" | "status";
type SortDir = "asc" | "desc";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [sidebar, setSidebar] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", excerpt: "", content: "", category: "eventos" as Category });
    const [saving, setSaving] = useState(false);

    /* Subscriber sorting */
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

    const sortedSubscribers = useMemo(() => {
        const filtered = filterStatus === "all"
            ? [...mockSubscribers]
            : mockSubscribers.filter(s => s.status === filterStatus);

        return filtered.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [sortField, sortDir, filterStatus]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setPosts([{
            id: String(Date.now()), ...newPost, author: "Kauan", published: true, featured: false,
            createdAt: new Date().toISOString(),
            readTime: `${Math.max(3, Math.ceil(newPost.content.length / 800))} min`,
        }, ...posts]);
        setNewPost({ title: "", excerpt: "", content: "", category: "eventos" });
        setSaving(false);
        setActiveTab("posts");
    };

    const currentLabel = NAV_ITEMS.find(t => t.id === activeTab)?.label;

    return (
        <div className="flex min-h-screen font-[var(--font-body)]">
            <Sidebar items={NAV_ITEMS} activeId={activeTab} onSelect={(id) => setActiveTab(id as Tab)} open={sidebar} onClose={() => setSidebar(false)} />

            {/* Main */}
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white dark:bg-accent-400/20 dark:text-accent-300">K</div>
                    </div>
                </header>

                <main className="p-6 sm:p-8">
                    {/* ═══ OVERVIEW ═══ */}
                    {activeTab === "overview" && (
                        <div className="animate-fade-in space-y-7">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                <StatCard label="Total de Inscritos" value={mockStats.totalSubscribers} delta={`+${mockStats.growthPercent}%`} colorClass="text-sky-600 bg-sky-50 dark:bg-accent-500/10 dark:text-accent-400" />
                                <StatCard label="Notícias Publicadas" value={mockStats.totalPosts} delta="+3 esta semana" colorClass="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" />
                                <StatCard label="Taxa de Abertura" value={mockStats.openRate} suffix="%" delta="+2.1%" colorClass="text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" />
                                <StatCard label="Crescimento Mensal" value={mockStats.growthPercent} suffix="%" delta="Consistente" colorClass="text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400" />
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
                                                <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(p.createdAt)} · {p.readTime}</p>
                                            </div>
                                            <Badge variant={p.published ? "success" : "default"}>{p.published ? "Publicado" : "Rascunho"}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* ═══ POSTS ═══ */}
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
                                                    <Badge variant={p.published ? "success" : "default"}>{p.published ? "Publicado" : "Rascunho"}</Badge>
                                                    {p.featured && <Badge variant="warning">Destaque</Badge>}
                                                </div>
                                                <h3 className="mb-1 font-[var(--font-heading)] text-sm font-bold text-brand dark:text-white">{p.title}</h3>
                                                <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{p.excerpt}</p>
                                                <div className="mt-1.5 flex gap-3 text-[11px] text-slate-400 dark:text-slate-500"><span>{formatDate(p.createdAt)}</span><span>{p.readTime}</span></div>
                                            </div>
                                            <button onClick={() => setPosts(posts.filter(x => x.id !== p.id))} className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10 cursor-pointer">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ SUBSCRIBERS ═══ */}
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
                                                {([["name", "Nome"], ["email", "Email"], ["createdAt", "Data"], ["status", "Status"]] as [SortField, string][]).map(([field, header]) => (
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
                                                    <td className="px-5 py-3"><span className="text-sm font-medium text-brand dark:text-white">{s.name}</span></td>
                                                    <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">{s.email}</td>
                                                    <td className="px-5 py-3 text-sm text-slate-400 dark:text-slate-500">{formatDate(s.createdAt)}</td>
                                                    <td className="px-5 py-3"><Badge variant={s.status === "active" ? "success" : "default"}>{s.status === "active" ? "Ativo" : "Inativo"}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* ═══ NEW POST ═══ */}
                    {activeTab === "new-post" && (
                        <div className="mx-auto max-w-3xl animate-fade-in">
                            <form onSubmit={handleCreate} className="space-y-5">
                                <Card>
                                    <CardContent>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Título</label>
                                        <input type="text" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required placeholder="Um título impactante…"
                                            className="w-full border-none bg-transparent py-1 font-[var(--font-heading)] text-xl font-extrabold text-brand placeholder-slate-300 focus:outline-none dark:text-white dark:placeholder-slate-600" />
                                    </CardContent>
                                </Card>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Card>
                                        <CardContent>
                                            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Categoria</label>
                                            <div className="flex gap-2">
                                                {CATEGORIES.map(c => (
                                                    <button key={c.value} type="button" onClick={() => setNewPost({ ...newPost, category: c.value })}
                                                        className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${newPost.category === c.value
                                                            ? "bg-brand text-white dark:bg-accent-400 dark:text-brand-900"
                                                            : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-white/[.04] dark:text-slate-400 dark:hover:bg-white/[.06]"}`}>{c.label}</button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Resumo</label>
                                            <textarea value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} required rows={3} placeholder="Breve resumo…"
                                                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/[.03] dark:text-white dark:placeholder-slate-600 dark:focus:border-accent-400" />
                                        </CardContent>
                                    </Card>
                                </div>
                                <Card>
                                    <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required rows={14} placeholder="Escreva o conteúdo (suporta HTML)…"
                                        className="w-full resize-none rounded-2xl bg-transparent p-5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-600" />
                                </Card>
                                <div className="flex gap-3">
                                    <Button type="submit" loading={saving}>{saving ? "Publicando…" : "Publicar"}</Button>
                                    <Button type="button" variant="secondary">Rascunho</Button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
