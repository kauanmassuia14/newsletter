"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export interface SidebarItem {
    id: string;
    label: string;
    icon: ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
    activeId: string;
    onSelect: (id: string) => void;
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ items, activeId, onSelect, open, onClose }: SidebarProps) {
    return (
        <>
            {open && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-slate-100 bg-white transition-transform duration-300
          dark:border-white/[.06] dark:bg-brand-900 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col h-full px-4 py-5">
                    {/* Brand */}
                    <div className="mb-7 flex items-center gap-2.5 px-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand dark:bg-accent-400">
                            <span className="text-xs font-extrabold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
                        </div>
                        <div className="leading-none">
                            <span className="block font-[var(--font-heading)] text-sm font-bold text-brand dark:text-white">Connect&Story</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">Painel Admin</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-0.5">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { onSelect(item.id); onClose(); }}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition cursor-pointer
                  ${activeId === item.id
                                        ? "bg-accent-50 text-brand dark:bg-accent-400/10 dark:text-accent-300"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[.03] dark:hover:text-slate-200"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Footer Links */}
                    <div className="space-y-0.5 border-t border-slate-100 pt-3 dark:border-white/[.06]">
                        <Link href="/feed" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/[.03]">
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            Ver Feed
                        </Link>
                        <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 transition hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/[.03]">
                            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Sair
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
