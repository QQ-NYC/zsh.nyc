import React from 'react';
import { z } from 'zod';
import { ColorSystem, EmojiSystem } from '../../utils/colors/colors-emoji-system';
export declare const ThemeProfileSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    theme: z.ZodString;
    emojiSet: z.ZodArray<z.ZodString, "many">;
    layout: z.ZodEnum<["compact", "comfortable", "spacious"]>;
    animations: z.ZodBoolean;
    accessibility: z.ZodObject<{
        highContrast: z.ZodBoolean;
        largeText: z.ZodBoolean;
        reducedMotion: z.ZodBoolean;
        screenReader: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        highContrast: boolean;
        largeText: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    }, {
        highContrast: boolean;
        largeText: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    }>;
    shortcuts: z.ZodRecord<z.ZodString, z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    theme: string;
    emojiSet: string[];
    layout: "compact" | "comfortable" | "spacious";
    animations: boolean;
    accessibility: {
        highContrast: boolean;
        largeText: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    };
    shortcuts: Record<string, string>;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    theme: string;
    emojiSet: string[];
    layout: "compact" | "comfortable" | "spacious";
    animations: boolean;
    accessibility: {
        highContrast: boolean;
        largeText: boolean;
        reducedMotion: boolean;
        screenReader: boolean;
    };
    shortcuts: Record<string, string>;
}>;
export type ThemeProfile = z.infer<typeof ThemeProfileSchema>;
export declare class ThemeManager {
    private colorSystem;
    private profiles;
    private currentProfile;
    constructor(colorSystem: ColorSystem);
    private initializeDefaultProfiles;
    setCurrentProfile(profileId: string): boolean;
    getCurrentProfile(): ThemeProfile | null;
    getProfile(profileId: string): ThemeProfile | undefined;
    createProfile(profile: Omit<ThemeProfile, 'id' | 'createdAt' | 'updatedAt'>): string;
    updateProfile(profileId: string, updates: Partial<ThemeProfile>): boolean;
    deleteProfile(profileId: string): boolean;
    getAllProfiles(): ThemeProfile[];
    getAvailableThemes(): string[];
}
export declare class PersonalizationManager {
    private themeManager;
    private emojiSystem;
    private userPreferences;
    constructor(themeManager: ThemeManager, emojiSystem: EmojiSystem);
    setPreference(key: string, value: any): void;
    getPreference(key: string): any;
    getAllPreferences(): Record<string, any>;
    exportSettings(): string;
    importSettings(settingsJson: string): boolean;
    getAccessibilitySettings(): ThemeProfile['accessibility'];
    setAccessibilitySetting(setting: keyof ThemeProfile['accessibility'], value: boolean): void;
}
export declare const ThemePersonalizationInterface: React.FC<{
    themeManager: ThemeManager;
    personalizationManager: PersonalizationManager;
    onProfileChange: (profile: ThemeProfile) => void;
}>;
//# sourceMappingURL=themes-personalization.d.ts.map