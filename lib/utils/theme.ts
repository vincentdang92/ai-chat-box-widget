import { ThemeConfig } from '../types';

/**
 * Converts hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Calculates luminance of a color
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const val = c / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Gets contrasting text color (black or white) based on background
 */
export function getContrastColor(hexColor: string): string {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#000000';

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Generates lighter shade of a color
 */
export function lightenColor(hexColor: string, percent: number): string {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const { r, g, b } = rgb;
    const amount = Math.round(2.55 * percent);

    const newR = Math.min(255, r + amount);
    const newG = Math.min(255, g + amount);
    const newB = Math.min(255, b + amount);

    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

/**
 * Generates darker shade of a color
 */
export function darkenColor(hexColor: string, percent: number): string {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const { r, g, b } = rgb;
    const amount = Math.round(2.55 * percent);

    const newR = Math.max(0, r - amount);
    const newG = Math.max(0, g - amount);
    const newB = Math.max(0, b - amount);

    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

/**
 * Applies theme colors to CSS variables
 */
export function applyTheme(primaryColor: string): ThemeConfig {
    const theme: ThemeConfig = {
        primaryColor,
        primaryDark: darkenColor(primaryColor, 15),
        primaryLight: lightenColor(primaryColor, 15),
        background: '#FFFFFF',
        foreground: getContrastColor(primaryColor),
    };

    // Apply to CSS variables
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--primary-dark', theme.primaryDark);
        root.style.setProperty('--primary-light', theme.primaryLight);
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--foreground', theme.foreground);
    }

    return theme;
}

/**
 * Removes theme CSS variables
 */
export function removeTheme(): void {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--primary-dark');
        root.style.removeProperty('--primary-light');
        root.style.removeProperty('--background');
        root.style.removeProperty('--foreground');
    }
}
