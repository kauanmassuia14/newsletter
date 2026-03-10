import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Connect & Story",
    description: "Painel administrativo para gerenciar notícias, inscritos e métricas da newsletter Connect & Story.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
