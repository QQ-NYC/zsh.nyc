import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { z } from 'zod';
// Theme and Personalization Management System
export const ThemeProfileSchema = z.object({
    id: z.string(),
    name: z.string(),
    theme: z.string(), // theme name
    emojiSet: z.array(z.string()), // preferred emoji names
    layout: z.enum(['compact', 'comfortable', 'spacious']),
    animations: z.boolean(),
    accessibility: z.object({
        highContrast: z.boolean(),
        largeText: z.boolean(),
        reducedMotion: z.boolean(),
        screenReader: z.boolean()
    }),
    shortcuts: z.record(z.string()), // custom keyboard shortcuts
    createdAt: z.date(),
    updatedAt: z.date()
});
export class ThemeManager {
    constructor(colorSystem) {
        this.profiles = new Map();
        this.currentProfile = null;
        this.colorSystem = colorSystem;
        this.initializeDefaultProfiles();
    }
    initializeDefaultProfiles() {
        const defaultProfile = {
            id: 'default',
            name: 'Default',
            theme: 'default',
            emojiSet: ['star', 'check mark', 'warning', 'information'],
            layout: 'comfortable',
            animations: true,
            accessibility: {
                highContrast: false,
                largeText: false,
                reducedMotion: false,
                screenReader: false
            },
            shortcuts: {
                'quit': 'ctrl+c',
                'help': 'f1',
                'search': 'ctrl+f'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const darkProfile = {
            id: 'dark',
            name: 'Dark Mode',
            theme: 'dark',
            emojiSet: ['moon', 'star', 'zap', 'target'],
            layout: 'compact',
            animations: true,
            accessibility: {
                highContrast: true,
                largeText: false,
                reducedMotion: false,
                screenReader: false
            },
            shortcuts: {
                'quit': 'ctrl+c',
                'help': 'f1',
                'search': 'ctrl+f',
                'theme': 'f2'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const neonProfile = {
            id: 'neon',
            name: 'Neon Cyber',
            theme: 'neon',
            emojiSet: ['zap', 'star', 'target', 'palette'],
            layout: 'spacious',
            animations: true,
            accessibility: {
                highContrast: true,
                largeText: false,
                reducedMotion: false,
                screenReader: false
            },
            shortcuts: {
                'quit': 'ctrl+c',
                'help': 'f1',
                'search': 'ctrl+f',
                'theme': 'f2',
                'visualize': 'f3'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.profiles.set('default', defaultProfile);
        this.profiles.set('dark', darkProfile);
        this.profiles.set('neon', neonProfile);
    }
    setCurrentProfile(profileId) {
        if (this.profiles.has(profileId)) {
            this.currentProfile = profileId;
            const profile = this.profiles.get(profileId);
            this.colorSystem.setTheme(profile.theme);
            return true;
        }
        return false;
    }
    getCurrentProfile() {
        return this.currentProfile ? this.profiles.get(this.currentProfile) || null : null;
    }
    getProfile(profileId) {
        return this.profiles.get(profileId);
    }
    createProfile(profile) {
        const id = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newProfile = {
            ...profile,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.profiles.set(id, newProfile);
        return id;
    }
    updateProfile(profileId, updates) {
        const existing = this.profiles.get(profileId);
        if (!existing)
            return false;
        this.profiles.set(profileId, {
            ...existing,
            ...updates,
            updatedAt: new Date()
        });
        return true;
    }
    deleteProfile(profileId) {
        if (profileId === 'default')
            return false; // Can't delete default
        return this.profiles.delete(profileId);
    }
    getAllProfiles() {
        return Array.from(this.profiles.values());
    }
    getAvailableThemes() {
        return this.colorSystem.getAvailableThemes();
    }
}
export class PersonalizationManager {
    constructor(themeManager, emojiSystem) {
        this.userPreferences = new Map();
        this.themeManager = themeManager;
        this.emojiSystem = emojiSystem;
    }
    setPreference(key, value) {
        this.userPreferences.set(key, value);
    }
    getPreference(key) {
        return this.userPreferences.get(key);
    }
    getAllPreferences() {
        return Object.fromEntries(this.userPreferences);
    }
    exportSettings() {
        const settings = {
            currentProfile: this.themeManager.getCurrentProfile(),
            preferences: this.getAllPreferences(),
            allProfiles: this.themeManager.getAllProfiles()
        };
        return JSON.stringify(settings, null, 2);
    }
    importSettings(settingsJson) {
        try {
            const settings = JSON.parse(settingsJson);
            // Import profiles
            if (settings.allProfiles) {
                settings.allProfiles.forEach((profile) => {
                    if (!this.themeManager.getProfile(profile.id)) {
                        this.themeManager.createProfile(profile);
                    }
                });
            }
            // Set current profile
            if (settings.currentProfile) {
                this.themeManager.setCurrentProfile(settings.currentProfile.id);
            }
            // Import preferences
            if (settings.preferences) {
                Object.entries(settings.preferences).forEach(([key, value]) => {
                    this.setPreference(key, value);
                });
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    getAccessibilitySettings() {
        const currentProfile = this.themeManager.getCurrentProfile();
        return currentProfile?.accessibility || {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false
        };
    }
    setAccessibilitySetting(setting, value) {
        const currentProfile = this.themeManager.getCurrentProfile();
        if (currentProfile) {
            this.themeManager.updateProfile(currentProfile.id, {
                accessibility: {
                    ...currentProfile.accessibility,
                    [setting]: value
                }
            });
        }
    }
}
// React Components
export const ThemePersonalizationInterface = ({ themeManager, personalizationManager, onProfileChange }) => {
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const profiles = themeManager.getAllProfiles();
    const currentProfile = themeManager.getCurrentProfile();
    useInput((input, key) => {
        if (key.return) {
            if (selectedProfile) {
                themeManager.setCurrentProfile(selectedProfile);
                onProfileChange(themeManager.getProfile(selectedProfile));
            }
        }
        else if (input === 's') {
            setShowSettings(!showSettings);
        }
        else if (input === 'q') {
            // Quit theme interface
        }
    });
    const accessibility = personalizationManager.getAccessibilitySettings();
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Text, { bold: true, color: "magenta", children: "Theme & Personalization" }), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { children: "Current Profile: " }), _jsx(Text, { color: "cyan", children: currentProfile?.name || 'None' })] }), _jsxs(Box, { flexDirection: "column", marginY: 1, children: [_jsx(Text, { dimColor: true, children: "Available Profiles:" }), profiles.map((profile, index) => (_jsxs(Box, { marginY: 1, children: [_jsxs(Text, { color: selectedProfile === profile.id ? 'green' : 'white', bold: currentProfile?.id === profile.id, children: [index + 1, ". ", profile.name, currentProfile?.id === profile.id && ' (active)'] }), _jsxs(Box, { paddingLeft: 4, children: [_jsxs(Text, { dimColor: true, children: ["Theme: ", profile.theme] }), _jsxs(Text, { dimColor: true, children: ["Layout: ", profile.layout] }), _jsxs(Text, { dimColor: true, children: ["Animations: ", profile.animations ? 'enabled' : 'disabled'] })] })] }, profile.id)))] }), showSettings && (_jsxs(Box, { flexDirection: "column", marginY: 1, children: [_jsx(Text, { bold: true, color: "yellow", children: "Accessibility Settings:" }), _jsxs(Box, { flexDirection: "column", paddingLeft: 2, children: [_jsxs(Text, { children: ["High Contrast: ", accessibility.highContrast ? '✅' : '❌'] }), _jsxs(Text, { children: ["Large Text: ", accessibility.largeText ? '✅' : '❌'] }), _jsxs(Text, { children: ["Reduced Motion: ", accessibility.reducedMotion ? '✅' : '❌'] }), _jsxs(Text, { children: ["Screen Reader: ", accessibility.screenReader ? '✅' : '❌'] })] })] })), _jsxs(Box, { marginY: 1, children: [_jsx(Text, { dimColor: true, children: "Controls:" }), _jsx(Text, { dimColor: true, children: " \u2022 Number keys: Select profile" }), _jsx(Text, { dimColor: true, children: " \u2022 Enter: Apply selected profile" }), _jsx(Text, { dimColor: true, children: " \u2022 's': Toggle settings" }), _jsx(Text, { dimColor: true, children: " \u2022 'q': Quit" })] })] }));
};
//# sourceMappingURL=themes-personalization.js.map