import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Feed de Notícias | Connect & Story",
    description: "Leia os melhores conteúdos sobre eventos, palestras e storytelling na plataforma Connect & Story.",
};

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
