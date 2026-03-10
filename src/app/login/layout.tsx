import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Connect & Story",
    description: "Acesse sua conta na plataforma Connect & Story para ler conteúdos exclusivos sobre eventos, palestras e storytelling.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
