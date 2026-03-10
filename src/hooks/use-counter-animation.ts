"use client";

import { useState, useEffect, useRef } from "react";

export function useCounterAnimation(target: number, duration = 1200): number {
    const [value, setValue] = useState(0);
    const ref = useRef<number | null>(null);

    useEffect(() => {
        if (target === 0) { setValue(0); return; }

        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));

            if (progress < 1) {
                ref.current = requestAnimationFrame(tick);
            }
        }

        ref.current = requestAnimationFrame(tick);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [target, duration]);

    return value;
}
