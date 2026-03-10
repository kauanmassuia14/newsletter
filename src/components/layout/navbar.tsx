"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface NavbarProps {
    variant?: "landing" | "feed" | "admin";
}

function Logo() {
    return (
        <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-sm transition group-hover:scale-105 dark:bg-accent-400">
                <span className="text-xs font-extrabold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
            </div>
            <span className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-brand dark:text-white">
                Connect&Story
            </span>
        </Link>
    );
}

export function Navbar({ variant = "landing" }: NavbarProps) {
    const isLanding = variant === "landing";
    const isFeed = variant === "feed";

    return (
        <nav className={`${isLanding ? "fixed" : "sticky"} inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-white/[.06] dark:bg-brand-900/80`}>
            <div className={`mx-auto flex items-center justify-between px-4 py-3 sm:px-6 ${isFeed ? "max-w-[620px]" : "max-w-7xl"}`}>
                {isFeed ? (
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand transition group-hover:scale-105 dark:bg-accent-400">
                            <span className="text-xs font-extrabold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
                        </div>
                    </Link>
                ) : (
                    <Logo />
                )}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {isLanding && (
                        <>
                            <Link href="/feed" className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-brand dark:text-slate-400 dark:hover:text-white sm:block">
                                Feed
                            </Link>
                            <Link href="/login">
                                <Button size="sm">Entrar</Button>
                            </Link>
                        </>
                    )}
                    {isFeed && (
                        <Link href="/dashboard" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-white/[.05]" title="Painel Admin">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
