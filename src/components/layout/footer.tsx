import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white py-10 dark:border-white/[.06] dark:bg-brand-900">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 sm:flex-row">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand dark:bg-accent-400">
                        <span className="text-[10px] font-bold text-white font-[var(--font-heading)] dark:text-brand-900">C</span>
                    </div>
                    <span className="font-[var(--font-heading)] text-sm font-bold text-brand dark:text-white">
                        Connect&Story
                    </span>
                </div>
                <p className="text-xs text-slate-400">© 2026 Connect&Story. Todos os direitos reservados.</p>
                <div className="flex gap-5">
                    <Link href="/feed" className="text-xs text-slate-400 transition hover:text-brand dark:hover:text-white">Feed</Link>
                    <Link href="/login" className="text-xs text-slate-400 transition hover:text-brand dark:hover:text-white">Login</Link>
                </div>
            </div>
        </footer>
    );
}
