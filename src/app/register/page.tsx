"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const supabase = createClient();

            // 1. Sign Up
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;
            if (!data.user) throw new Error("Erro ao criar conta.");

            // 2. Update Profile with Display Name
            // Note: Trigger in DB usually creates the profile, we just update it
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    email: email
                })
                .eq('id', data.user.id);

            if (profileError) {
                console.error("Erro ao atualizar perfil:", profileError);
                // We don't throw here because the account WAS created, just the name failed
            }

            // Redirect to feed
            router.push("/feed");

        } catch (err: any) {
            console.error("Erro de Registro:", err);
            setError(err.message === "Failed to fetch"
                ? "Erro de conexão. Verifique sua internet."
                : (err.message || "Erro ao criar conta."));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen font-[var(--font-body)]">
            {/* Branding Panel (Same as Login) */}
            <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-brand via-brand-700 to-brand-900 lg:flex">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-accent-400/[.04] blur-[90px] animate-float" />
                    <div className="absolute -right-10 bottom-24 h-80 w-80 rounded-full bg-accent-400/[.04] blur-[100px] animate-float delay-300" />
                    <div className="absolute inset-0 bg-grid" />
                </div>
                <div className="relative z-10 max-w-sm px-10 text-center">
                    <h2 className="mb-5 font-[var(--font-heading)] text-3xl font-extrabold leading-tight text-white">
                        Faça parte da <span className="text-accent-400">história</span>
                    </h2>
                    <p className="text-base text-white/45">
                        Cadastre-se para comentar, salvar seus posts favoritos e receber notificações exclusivas.
                    </p>
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-1 items-center justify-center bg-white p-6 dark:bg-brand-900 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand dark:bg-accent-400">
                                <span className="text-xs font-extrabold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
                            </div>
                            <span className="font-[var(--font-heading)] text-base font-bold text-brand dark:text-white">Connect&Story</span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <h1 className="mb-1.5 font-[var(--font-heading)] text-2xl font-extrabold text-brand dark:text-white">Criar sua conta</h1>
                    <p className="mb-7 text-sm text-slate-400 dark:text-slate-500">Junte-se a nós para uma experiência completa</p>

                    {error && (
                        <div className="mb-5 flex animate-scale-up items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            id="reg-name"
                            type="text"
                            label="Nome de Usuário"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            placeholder="Como quer ser chamado?"
                        />
                        <Input
                            id="reg-email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                        <Input
                            id="reg-password"
                            type="password"
                            label="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Pelo menos 6 caracteres"
                        />
                        <Button id="reg-submit" type="submit" loading={isLoading} className="w-full">
                            {isLoading ? "Criando conta…" : "Criar Conta"}
                        </Button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-400 dark:text-slate-500">
                        Já tem uma conta? <Link href="/login" className="font-semibold text-brand transition hover:underline dark:text-accent-300">Entre aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
