import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { z } from 'zod';
import { ColorSystem, EmojiSystem } from '../../utils/colors/colors-emoji-system';

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

export type ThemeProfile = z.infer<typeof ThemeProfileSchema>;

export class ThemeManager {
  private colorSystem: ColorSystem;
  private profiles: Map<string, ThemeProfile> = new Map();
  private currentProfile: string | null = null;

  constructor(colorSystem: ColorSystem) {
    this.colorSystem = colorSystem;
    this.initializeDefaultProfiles();
  }

  private initializeDefaultProfiles() {
    const defaultProfile: ThemeProfile = {
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

    const darkProfile: ThemeProfile = {
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

    const neonProfile: ThemeProfile = {
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

  setCurrentProfile(profileId: string): boolean {
    if (this.profiles.has(profileId)) {
      this.currentProfile = profileId;
      const profile = this.profiles.get(profileId)!;
      this.colorSystem.setTheme(profile.theme);
      return true;
    }
    return false;
  }

  getCurrentProfile(): ThemeProfile | null {
    return this.currentProfile ? this.profiles.get(this.currentProfile) || null : null;
  }

  getProfile(profileId: string): ThemeProfile | undefined {
    return this.profiles.get(profileId);
  }

  createProfile(profile: Omit<ThemeProfile, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProfile: ThemeProfile = {
      ...profile,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.profiles.set(id, newProfile);
    return id;
  }

  updateProfile(profileId: string, updates: Partial<ThemeProfile>): boolean {
    const existing = this.profiles.get(profileId);
    if (!existing) return false;

    this.profiles.set(profileId, {
      ...existing,
      ...updates,
      updatedAt: new Date()
    });
    return true;
  }

  deleteProfile(profileId: string): boolean {
    if (profileId === 'default') return false; // Can't delete default
    return this.profiles.delete(profileId);
  }

  getAllProfiles(): ThemeProfile[] {
    return Array.from(this.profiles.values());
  }

  getAvailableThemes(): string[] {
    return this.colorSystem.getAvailableThemes();
  }
}

export class PersonalizationManager {
  private themeManager: ThemeManager;
  private emojiSystem: EmojiSystem;
  private userPreferences: Map<string, any> = new Map();

  constructor(themeManager: ThemeManager, emojiSystem: EmojiSystem) {
    this.themeManager = themeManager;
    this.emojiSystem = emojiSystem;
  }

  setPreference(key: string, value: any): void {
    this.userPreferences.set(key, value);
  }

  getPreference(key: string): any {
    return this.userPreferences.get(key);
  }

  getAllPreferences(): Record<string, any> {
    return Object.fromEntries(this.userPreferences);
  }

  exportSettings(): string {
    const settings = {
      currentProfile: this.themeManager.getCurrentProfile(),
      preferences: this.getAllPreferences(),
      allProfiles: this.themeManager.getAllProfiles()
    };
    return JSON.stringify(settings, null, 2);
  }

  importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson);

      // Import profiles
      if (settings.allProfiles) {
        settings.allProfiles.forEach((profile: ThemeProfile) => {
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
    } catch (error) {
      return false;
    }
  }

  getAccessibilitySettings(): ThemeProfile['accessibility'] {
    const currentProfile = this.themeManager.getCurrentProfile();
    return currentProfile?.accessibility || {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false
    };
  }

  setAccessibilitySetting(setting: keyof ThemeProfile['accessibility'], value: boolean): void {
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
export const ThemePersonalizationInterface: React.FC<{
  themeManager: ThemeManager;
  personalizationManager: PersonalizationManager;
  onProfileChange: (profile: ThemeProfile) => void;
}> = ({ themeManager, personalizationManager, onProfileChange }) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const profiles = themeManager.getAllProfiles();
  const currentProfile = themeManager.getCurrentProfile();

  useInput((input: string, key: any) => {
    if (key.return) {
      if (selectedProfile) {
        themeManager.setCurrentProfile(selectedProfile);
        onProfileChange(themeManager.getProfile(selectedProfile)!);
      }
    } else if (input === 's') {
      setShowSettings(!showSettings);
    } else if (input === 'q') {
      // Quit theme interface
    }
  });

  const accessibility = personalizationManager.getAccessibilitySettings();

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="magenta">Theme & Personalization</Text>

      <Box marginY={1}>
        <Text>Current Profile: </Text>
        <Text color="cyan">{currentProfile?.name || 'None'}</Text>
      </Box>

      <Box flexDirection="column" marginY={1}>
        <Text dimColor>Available Profiles:</Text>
        {profiles.map((profile, index) => (
          <Box key={profile.id} marginY={1}>
            <Text
              color={selectedProfile === profile.id ? 'green' : 'white'}
              bold={currentProfile?.id === profile.id}
            >
              {index + 1}. {profile.name}
              {currentProfile?.id === profile.id && ' (active)'}
            </Text>
            <Box paddingLeft={4}>
              <Text dimColor>Theme: {profile.theme}</Text>
              <Text dimColor>Layout: {profile.layout}</Text>
              <Text dimColor>Animations: {profile.animations ? 'enabled' : 'disabled'}</Text>
            </Box>
          </Box>
        ))}
      </Box>

      {showSettings && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="yellow">Accessibility Settings:</Text>
          <Box flexDirection="column" paddingLeft={2}>
            <Text>High Contrast: {accessibility.highContrast ? '✅' : '❌'}</Text>
            <Text>Large Text: {accessibility.largeText ? '✅' : '❌'}</Text>
            <Text>Reduced Motion: {accessibility.reducedMotion ? '✅' : '❌'}</Text>
            <Text>Screen Reader: {accessibility.screenReader ? '✅' : '❌'}</Text>
          </Box>
        </Box>
      )}

      <Box marginY={1}>
        <Text dimColor>Controls:</Text>
        <Text dimColor> • Number keys: Select profile</Text>
        <Text dimColor> • Enter: Apply selected profile</Text>
        <Text dimColor> • 's': Toggle settings</Text>
        <Text dimColor> • 'q': Quit</Text>
      </Box>
    </Box>
  );
};