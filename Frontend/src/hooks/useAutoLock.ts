import { useCallback, useEffect, useRef } from "react";

interface UseAutoLockOptions {
    timeout: number;
    onLock: () => void;
    enabled?: boolean;
}

export function useAutoLock({
    timeout,
    onLock,
    enabled = true
}: UseAutoLockOptions) {

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const resetTimer = useCallback(() => {

        if (!enabled) {
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            onLock();
        }, timeout);
}, [enabled, timeout, onLock]);

    useEffect(() => {

        if (!enabled) {
            return;
        }

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll"
        ];

        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };

    }, [enabled, timeout, resetTimer]);

    return {
        resetTimer
    };
}