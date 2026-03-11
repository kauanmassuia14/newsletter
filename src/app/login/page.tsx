"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            if (!data.user) throw new Error("Usuário não encontrado.");

            // Check profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', data.user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error("Erro ao buscar perfil:", profileError);
            }

            if (profile?.is_admin) {
                router.push("/dashboard");
            } else {
                router.push("/feed");
            }
        } catch (err: any) {
            console.error("Erro de Login:", err);
            setError(err.message === "Failed to fetch"
                ? "Erro de conexão: Verifique sua internet ou as configurações do Supabase."
                : (err.message || "Erro ao fazer login."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-[var(--font-body)]">
            {/* ─── Branding Panel ─── */}
            <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-brand via-brand-700 to-brand-900 lg:flex">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-accent-400/[.04] blur-[90px] animate-float" />
                    <div className="absolute -right-10 bottom-24 h-80 w-80 rounded-full bg-accent-400/[.04] blur-[100px] animate-float delay-300" />
                    <div className="absolute inset-0 bg-grid" />
                </div>

                <div className="relative z-10 max-w-sm px-10">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] backdrop-blur">
                            <span className="font-[var(--font-heading)] text-base font-extrabold text-white">C</span>
                        </div>
                        <span className="font-[var(--font-heading)] text-xl font-bold text-white">Connect&Story</span>
                    </div>

                    <h2 className="mb-5 animate-fade-up font-[var(--font-heading)] text-3xl font-extrabold leading-tight text-white">
                        Sua dose semanal de <span className="bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">inspiração</span>
                    </h2>
                    <p className="mb-10 text-base leading-relaxed text-white/45">
                        Acesse conteúdos exclusivos sobre eventos, palestras e a arte de contar histórias que transformam.
                    </p>

                    <div className="space-y-3.5">
                        {["Bastidores dos maiores eventos", "Análises exclusivas de palestras", "Frameworks de storytelling"].map((t, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                <span className="text-sm text-white/55">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Form Panel ─── */}
            <div className="flex flex-1 items-center justify-center bg-white p-6 dark:bg-brand-900 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-2 lg:hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand dark:bg-accent-400">
                                <span className="text-xs font-extrabold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
                            </div>
                            <span className="font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Connect&Story</span>
                        </div>
                        <ThemeToggle className="lg:ml-auto" />
                    </div>

                    <h1 className="mb-1.5 font-[var(--font-heading)] text-2xl font-extrabold text-brand dark:text-white">Bem-vindo de volta</h1>
                    <p className="mb-7 text-sm text-slate-400 dark:text-slate-500">Entre com suas credenciais para acessar a plataforma</p>

                    {error && (
                        <div className="mb-5 flex animate-scale-up items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            id="login-email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                        <Input
                            id="login-password"
                            type="password"
                            label="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Sua senha"
                        />
                        <Button id="login-submit" type="submit" loading={isLoading} className="w-full">
                            {isLoading ? "Entrando…" : "Entrar"}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                        <span className="text-xs text-slate-300 dark:text-slate-600">ou</span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                    </div>

                    <Button variant="secondary" className="w-full" icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    }>
                        Entrar com Magic Link
                    </Button>

                    <p className="mt-7 text-center text-sm text-slate-400 dark:text-slate-500">
                        Não tem conta? <Link href="/" className="font-semibold text-brand transition hover:underline dark:text-accent-300">Inscreva-se</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
