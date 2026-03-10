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
        await new Promise((r) => setTimeout(r, 1500));
        setState((prev) => ({ ...prev, isSubmitting: false, isSuccess: true }));
    }, [state.email]);

    return { ...state, setEmail, handleSubmit };
}
