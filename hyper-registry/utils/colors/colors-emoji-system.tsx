import React from 'react';
import { Box, Text } from 'ink';
import { z } from 'zod';

// Advanced Color and Emoji System for Universal Hyper Registry
export const ColorThemeSchema = z.object({
  name: z.string(),
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  foreground: z.string(),
  success: z.string(),
  warning: z.string(),
  error: z.string(),
  info: z.string(),
  muted: z.string(),
  border: z.string()
});

export type ColorTheme = z.infer<typeof ColorThemeSchema>;

export const EmojiCategorySchema = z.enum([
  'nature', 'food', 'activity', 'travel', 'objects', 'symbols', 'flags', 'people'
]);

export type EmojiCategory = z.infer<typeof EmojiCategorySchema>;

export const EmojiSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  category: EmojiCategorySchema,
  keywords: z.array(z.string()),
  context: z.array(z.string()) // contextual usage
});

export type Emoji = z.infer<typeof EmojiSchema>;

export class ColorSystem {
  private themes: Map<string, ColorTheme> = new Map();
  private currentTheme: string = 'default';

  constructor() {
    this.initializeDefaultThemes();
  }

  private initializeDefaultThemes() {
    const defaultTheme: ColorTheme = {
      name: 'default',
      primary: '#007acc',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#000000',
      foreground: '#ffffff',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',
      muted: '#6c757d',
      border: '#495057'
    };

    const darkTheme: ColorTheme = {
      name: 'dark',
      primary: '#61dafb',
      secondary: '#8e8e93',
      accent: '#30d158',
      background: '#1e1e1e',
      foreground: '#ffffff',
      success: '#30d158',
      warning: '#ff9f0a',
      error: '#ff453a',
      info: '#64d2ff',
      muted: '#8e8e93',
      border: '#48484a'
    };

    const neonTheme: ColorTheme = {
      name: 'neon',
      primary: '#00ff41',
      secondary: '#ff0080',
      accent: '#ffff00',
      background: '#000000',
      foreground: '#00ff41',
      success: '#00ff41',
      warning: '#ffff00',
      error: '#ff0080',
      info: '#00ffff',
      muted: '#008f11',
      border: '#00ff41'
    };

    this.themes.set('default', defaultTheme);
    this.themes.set('dark', darkTheme);
    this.themes.set('neon', neonTheme);
  }

  setTheme(themeName: string): boolean {
    if (this.themes.has(themeName)) {
      this.currentTheme = themeName;
      return true;
    }
    return false;
  }

  getCurrentTheme(): ColorTheme {
    return this.themes.get(this.currentTheme) || this.themes.get('default')!;
  }

  getTheme(themeName: string): ColorTheme | undefined {
    return this.themes.get(themeName);
  }

  addTheme(theme: ColorTheme): void {
    this.themes.set(theme.name, theme);
  }

  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple color interpolation (could be enhanced)
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

export class EmojiSystem {
  private emojis: Map<string, Emoji> = new Map();
  private categories: Map<EmojiCategory, Emoji[]> = new Map();

  constructor() {
    this.initializeEmojis();
  }

  private initializeEmojis() {
    const emojiData: Emoji[] = [
      // Nature emojis
      { symbol: '🌟', name: 'star', category: 'nature', keywords: ['star', 'night', 'sky'], context: ['favorites', 'ratings', 'special'] },
      { symbol: '🌙', name: 'moon', category: 'nature', keywords: ['moon', 'night', 'sleep'], context: ['night mode', 'calm', 'rest'] },
      { symbol: '☀️', name: 'sun', category: 'nature', keywords: ['sun', 'day', 'light'], context: ['day mode', 'energy', 'bright'] },
      { symbol: '🌈', name: 'rainbow', category: 'nature', keywords: ['rainbow', 'color', 'hope'], context: ['diversity', 'hope', 'colorful'] },

      // Activity emojis
      { symbol: '⚡', name: 'zap', category: 'activity', keywords: ['lightning', 'energy', 'fast'], context: ['performance', 'speed', 'power'] },
      { symbol: '🔍', name: 'magnifying glass', category: 'activity', keywords: ['search', 'find', 'investigate'], context: ['search', 'analysis', 'discovery'] },
      { symbol: '📊', name: 'chart', category: 'activity', keywords: ['chart', 'data', 'analytics'], context: ['statistics', 'data', 'metrics'] },
      { symbol: '🎯', name: 'target', category: 'activity', keywords: ['target', 'goal', 'aim'], context: ['goals', 'accuracy', 'focus'] },

      // Objects emojis
      { symbol: '📁', name: 'folder', category: 'objects', keywords: ['folder', 'directory', 'organize'], context: ['organization', 'files', 'structure'] },
      { symbol: '🔧', name: 'wrench', category: 'objects', keywords: ['tool', 'settings', 'configure'], context: ['configuration', 'tools', 'settings'] },
      { symbol: '🎨', name: 'palette', category: 'objects', keywords: ['art', 'color', 'design'], context: ['design', 'creativity', 'themes'] },
      { symbol: '🔗', name: 'link', category: 'objects', keywords: ['link', 'connection', 'relationship'], context: ['connections', 'relationships', 'links'] },

      // Symbols emojis
      { symbol: '✅', name: 'check mark', category: 'symbols', keywords: ['check', 'done', 'complete'], context: ['success', 'completion', 'approval'] },
      { symbol: '❌', name: 'cross mark', category: 'symbols', keywords: ['cross', 'error', 'cancel'], context: ['error', 'cancel', 'rejection'] },
      { symbol: '⚠️', name: 'warning', category: 'symbols', keywords: ['warning', 'caution', 'alert'], context: ['warnings', 'cautions', 'alerts'] },
      { symbol: 'ℹ️', name: 'information', category: 'symbols', keywords: ['info', 'information', 'help'], context: ['information', 'help', 'details'] }
    ];

    emojiData.forEach(emoji => {
      this.emojis.set(emoji.name, emoji);
      if (!this.categories.has(emoji.category)) {
        this.categories.set(emoji.category, []);
      }
      this.categories.get(emoji.category)!.push(emoji);
    });
  }

  getEmoji(name: string): Emoji | undefined {
    return this.emojis.get(name);
  }

  getEmojisByCategory(category: EmojiCategory): Emoji[] {
    return this.categories.get(category) || [];
  }

  searchEmojis(query: string): Emoji[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.emojis.values()).filter(emoji =>
      emoji.name.toLowerCase().includes(lowerQuery) ||
      emoji.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      emoji.context.some(context => context.toLowerCase().includes(lowerQuery))
    );
  }

  getContextualEmoji(context: string): Emoji[] {
    const lowerContext = context.toLowerCase();
    return Array.from(this.emojis.values()).filter(emoji =>
      emoji.context.some(ctx => ctx.toLowerCase().includes(lowerContext))
    );
  }

  getAllEmojis(): Emoji[] {
    return Array.from(this.emojis.values());
  }
}

// React Components
export const EmojiRenderer: React.FC<{ emoji: Emoji; size?: 'small' | 'medium' | 'large' }> = ({ emoji, size = 'medium' }) => {
  const sizeMap = {
    small: '1x',
    medium: '2x',
    large: '3x'
  };

  return (
    <Text>
      {emoji.symbol}
    </Text>
  );
};

export const EmojiSuggester: React.FC<{
  context: string;
  onSelect: (emoji: Emoji) => void;
  maxSuggestions?: number;
}> = ({ context, onSelect, maxSuggestions = 5 }) => {
  const emojiSystem = new EmojiSystem();
  const suggestions = emojiSystem.getContextualEmoji(context).slice(0, maxSuggestions);

  if (suggestions.length === 0) return null;

  return (
    <Box flexDirection="column">
      <Text dimColor>Suggested emojis for "{context}":</Text>
      <Box>
        {suggestions.map((emoji, index) => (
          <Box key={emoji.name} marginRight={1}>
            <Text color="cyan">
              {emoji.symbol} {emoji.name}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};