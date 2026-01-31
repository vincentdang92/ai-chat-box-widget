'use client';

import { useState, useEffect } from 'react';
import { generateId } from '../utils';

/**
 * Hook for managing thread persistence in localStorage
 */
export function useThreadPersistence(websiteKey: string) {
    const [threadId, setThreadId] = useState<string>('');
    const storageKey = `chat-thread-${websiteKey}`;

    useEffect(() => {
        // Load existing thread ID or create new one
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setThreadId(stored);
        } else {
            const newThreadId = generateId();
            localStorage.setItem(storageKey, newThreadId);
            setThreadId(newThreadId);
        }
    }, [storageKey]);

    const resetThread = () => {
        const newThreadId = generateId();
        localStorage.setItem(storageKey, newThreadId);
        setThreadId(newThreadId);
    };

    const clearThread = () => {
        localStorage.removeItem(storageKey);
        setThreadId('');
    };

    return {
        threadId,
        resetThread,
        clearThread,
    };
}
