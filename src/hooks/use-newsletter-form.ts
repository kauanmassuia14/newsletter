"use client";

import { useState, useCallback } from "react";

interface NewsletterFormState {
    email: string;
    isSubmitting: boolean;
    isSuccess: boolean;
}

export function useNewsletterForm() {
    const [state, setState] = useState<NewsletterFormState>({
        email: "",
        isSubmitting: false,
        isSuccess: false,
    });

    const setEmail = useCallback((email: string) => {
        setState((prev) => ({ ...prev, email }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.email) return;

        setState((prev) => ({ ...prev, isSubmitting: true }));

        try {
            const { createClient } = await import("@/lib/supabase");
            const supabase = createClient();

            const { error } = await supabase
                .from('subscribers')
                .insert([{ email: state.email, status: 'active' }]);

            if (error && error.code !== '23505') { // Ignore duplicate emails
                throw error;
            }

            setState((prev) => ({ ...prev, isSubmitting: false, isSuccess: true }));
        } catch (error) {
            console.error("Erro ao assinar:", error);
            setState((prev) => ({ ...prev, isSubmitting: false }));
            alert("Ocorreu um erro ao processar sua assinatura. Tente novamente.");
        }
    }, [state.email]);

    return { ...state, setEmail, handleSubmit };
}
