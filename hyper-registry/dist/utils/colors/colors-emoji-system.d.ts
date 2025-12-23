import React from 'react';
import { z } from 'zod';
export declare const ColorThemeSchema: z.ZodObject<{
    name: z.ZodString;
    primary: z.ZodString;
    secondary: z.ZodString;
    accent: z.ZodString;
    background: z.ZodString;
    foreground: z.ZodString;
    success: z.ZodString;
    warning: z.ZodString;
    error: z.ZodString;
    info: z.ZodString;
    muted: z.ZodString;
    border: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    info: string;
    error: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    success: string;
    warning: string;
    muted: string;
    border: string;
}, {
    name: string;
    info: string;
    error: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    success: string;
    warning: string;
    muted: string;
    border: string;
}>;
export type ColorTheme = z.infer<typeof ColorThemeSchema>;
export declare const EmojiCategorySchema: z.ZodEnum<["nature", "food", "activity", "travel", "objects", "symbols", "flags", "people"]>;
export type EmojiCategory = z.infer<typeof EmojiCategorySchema>;
export declare const EmojiSchema: z.ZodObject<{
    symbol: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["nature", "food", "activity", "travel", "objects", "symbols", "flags", "people"]>;
    keywords: z.ZodArray<z.ZodString, "many">;
    context: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    context: string[];
    category: "nature" | "food" | "activity" | "travel" | "objects" | "symbols" | "flags" | "people";
    keywords: string[];
}, {
    symbol: string;
    name: string;
    context: string[];
    category: "nature" | "food" | "activity" | "travel" | "objects" | "symbols" | "flags" | "people";
    keywords: string[];
}>;
export type Emoji = z.infer<typeof EmojiSchema>;
export declare class ColorSystem {
    private themes;
    private currentTheme;
    constructor();
    private initializeDefaultThemes;
    setTheme(themeName: string): boolean;
    getCurrentTheme(): ColorTheme;
    getTheme(themeName: string): ColorTheme | undefined;
    addTheme(theme: ColorTheme): void;
    getAvailableThemes(): string[];
    interpolateColor(color1: string, color2: string, factor: number): string;
}
export declare class EmojiSystem {
    private emojis;
    private categories;
    constructor();
    private initializeEmojis;
    getEmoji(name: string): Emoji | undefined;
    getEmojisByCategory(category: EmojiCategory): Emoji[];
    searchEmojis(query: string): Emoji[];
    getContextualEmoji(context: string): Emoji[];
    getAllEmojis(): Emoji[];
}
export declare const EmojiRenderer: React.FC<{
    emoji: Emoji;
    size?: 'small' | 'medium' | 'large';
}>;
export declare const EmojiSuggester: React.FC<{
    context: string;
    onSelect: (emoji: Emoji) => void;
    maxSuggestions?: number;
}>;
//# sourceMappingURL=colors-emoji-system.d.ts.map