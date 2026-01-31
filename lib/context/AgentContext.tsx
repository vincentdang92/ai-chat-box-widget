'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WidgetConfig, AgentContextValue, ThemeConfig } from '../types';
import { applyTheme, removeTheme } from '../utils/theme';

const AgentContext = createContext<AgentContextValue | undefined>(undefined);

interface AgentProviderProps {
    websiteKey: string;
    children: ReactNode;
    apiUrl?: string;
}

export function AgentProvider({ websiteKey, children, apiUrl }: AgentProviderProps) {
    const [config, setConfig] = useState<WidgetConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<ThemeConfig | null>(null);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            setError(null);

            const baseUrl = apiUrl || '';
            const response = await fetch(`${baseUrl}/api/widget/config?websiteKey=${websiteKey}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch config: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to load configuration');
            }

            setConfig(data.data);

            // Apply theme
            if (data.data.primaryColor) {
                const newTheme = applyTheme(data.data.primaryColor);
                setTheme(newTheme);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            console.error('Error fetching widget config:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (websiteKey) {
            fetchConfig();
        }

        // Cleanup theme on unmount
        return () => {
            removeTheme();
        };
    }, [websiteKey]);

    const value: AgentContextValue = {
        config,
        loading,
        error,
        theme,
        refreshConfig: fetchConfig,
    };

    return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent(): AgentContextValue {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
}
