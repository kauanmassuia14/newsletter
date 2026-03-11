"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        display_name: "",
        bio: "",
        avatar_url: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data } = await supabase
                .from('profiles')
                .select('display_name, bio, avatar_url')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        const supabase = createClient();
        const { error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', user.id);

        if (error) {
            setMessage({ text: error.message, type: "error" });
        } else {
            setMessage({ text: "Perfil atualizado com sucesso!", type: "success" });
        }
        setSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const supabase = createClient();

        try {
            // 1. Upload file
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // 3. Update state
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setMessage({ text: "Foto carregada! Salve para confirmar.", type: "success" });
        } catch (error: any) {
            console.error("Erro no upload:", error);
            setMessage({ text: "Erro ao subir imagem: " + error.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            setMessage({ text: error.message, type: "error" });
        } else {
            setMessage({ text: "Email de redefinição de senha enviado!", type: "success" });
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center dark:bg-brand-900">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent dark:border-accent-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/30 font-[var(--font-body)] dark:bg-brand-900">
            <Navbar variant="feed" />

            <main className="mx-auto max-w-2xl px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-[var(--font-heading)] text-3xl font-extrabold text-brand dark:text-white">Configurações</h1>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Gerencie seu perfil e preferência da conta</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 rounded-xl border p-4 text-sm animate-scale-up ${message.type === "success"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "border-red-100 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <div className="relative group">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-brand text-3xl font-bold text-white shadow-lg dark:bg-accent-400/20 dark:text-accent-300">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            (profile.display_name || user.email)?.[0].toUpperCase()
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-brand shadow-sm transition hover:scale-110 dark:bg-brand-800 dark:text-white"
                                    >
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-brand dark:text-white">{profile.display_name || "Seu Nome"}</p>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Tamanho recomendado: 400x400px</p>
                                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">Membro desde {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="Nome de Exibição"
                                    value={profile.display_name || ""}
                                    onChange={e => setProfile({ ...profile, display_name: e.target.value })}
                                    placeholder="Como quer ser chamado?"
                                />
                                <Input
                                    label="URL do Avatar (ou use o upload)"
                                    value={profile.avatar_url || ""}
                                    onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
                                    placeholder="https://exemplo.com/foto.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bio</label>
                                <textarea
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-brand placeholder-slate-400 transition focus:border-brand focus:ring-0 dark:border-white/10 dark:bg-white/[.03] dark:text-white dark:focus:border-brand"
                                    rows={4}
                                    value={profile.bio || ""}
                                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Conte um pouco sobre você..."
                                />
                            </div>

                            <Button type="submit" loading={saving} className="w-full">
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <h3 className="mb-4 text-sm font-bold text-brand dark:text-white flex items-center gap-2">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                Segurança
                            </h3>
                            <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">Deseja alterar sua senha? Enviaremos um link de confirmação para o seu email.</p>
                            <Button type="button" variant="secondary" onClick={handleResetPassword} className="w-full">
                                Redefinir Senha via Email
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </main>
        </div>
    );
}
