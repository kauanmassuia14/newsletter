"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY_LIKED = "cs_liked";
const STORAGE_KEY_SAVED = "cs_saved";

function loadSet(key: string): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(key);
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

function persistSet(key: string, set: Set<string>) {
    localStorage.setItem(key, JSON.stringify([...set]));
}

export function useEngagement() {
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [saved, setSaved] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setLiked(loadSet(STORAGE_KEY_LIKED));
        setSaved(loadSet(STORAGE_KEY_SAVED));
        setHydrated(true);
    }, []);

    const toggleLike = useCallback((id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLiked((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            persistSet(STORAGE_KEY_LIKED, next);
            return next;
        });
    }, []);

    const toggleSave = useCallback((id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSaved((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            persistSet(STORAGE_KEY_SAVED, next);
            return next;
        });
    }, []);

    return { liked, saved, toggleLike, toggleSave, hydrated };
}
