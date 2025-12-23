import { z } from 'zod';

// NLP (Natural Language Processing) Processor for Universal Hyper Registry
export const IntentSchema = z.enum([
  'search', 'create', 'update', 'delete', 'analyze', 'generate',
  'navigate', 'configure', 'help', 'list', 'describe', 'compare'
]);

export type Intent = z.infer<typeof IntentSchema>;

export const EntitySchema = z.object({
  type: z.enum(['registry', 'entry', 'tag', 'user', 'system', 'command', 'path', 'url']),
  value: z.string(),
  confidence: z.number(),
  start: z.number(),
  end: z.number(),
  metadata: z.record(z.any()).optional()
});

export type Entity = z.infer<typeof EntitySchema>;

export const ContextDataSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  timestamp: z.date(),
  previousIntents: z.array(IntentSchema),
  currentPath: z.string().optional(),
  activeRegistries: z.array(z.string()),
  userPreferences: z.record(z.any()).optional()
});

export type ContextData = z.infer<typeof ContextDataSchema>;

export const NLPAnalysisSchema = z.object({
  text: z.string(),
  intent: IntentSchema,
  confidence: z.number(),
  entities: z.array(EntitySchema),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  urgency: z.enum(['low', 'medium', 'high']),
  context: ContextDataSchema,
  suggestions: z.array(z.string()).optional()
});

export type NLPAnalysis = z.infer<typeof NLPAnalysisSchema>;

export class ContextManager {
  private contextHistory: ContextData[] = [];
  private maxHistorySize: number = 10;

  addContext(context: ContextData): void {
    this.contextHistory.push(context);
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory.shift();
    }
  }

  getCurrentContext(): ContextData | null {
    return this.contextHistory.length > 0 ? this.contextHistory[this.contextHistory.length - 1] : null;
  }

  getContextHistory(): ContextData[] {
    return [...this.contextHistory];
  }

  clearHistory(): void {
    this.contextHistory = [];
  }

  getRecentIntents(count: number = 5): Intent[] {
    const recentContexts = this.contextHistory.slice(-count);
    return recentContexts.flatMap(ctx => ctx.previousIntents);
  }

  updateContext(updates: Partial<ContextData>): void {
    const current = this.getCurrentContext();
    if (current) {
      const updated = { ...current, ...updates, timestamp: new Date() };
      this.contextHistory[this.contextHistory.length - 1] = updated;
    }
  }
}

export class PromptEngineer {
  private templates: Map<Intent, string[]> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    this.templates.set('search', [
      'Find {entity} in the registry',
      'Search for {entity} with tags {tags}',
      'Look up {entity} in {registry}',
      'Query the registry for {entity}'
    ]);

    this.templates.set('create', [
      'Create a new {entity} with name {name}',
      'Add {entity} to the registry',
      'Register new {entity}: {description}',
      'Create entry for {entity}'
    ]);

    this.templates.set('update', [
      'Update {entity} with new information',
      'Modify {entity} in the registry',
      'Change {entity} details',
      'Edit {entity} properties'
    ]);

    this.templates.set('delete', [
      'Remove {entity} from the registry',
      'Delete {entity}',
      'Unregister {entity}',
      'Remove entry for {entity}'
    ]);

    this.templates.set('analyze', [
      'Analyze {entity} data',
      'Get statistics for {entity}',
      'Examine {entity} relationships',
      'Analyze registry {entity}'
    ]);

    this.templates.set('generate', [
      'Generate report for {entity}',
      'Create summary of {entity}',
      'Produce documentation for {entity}',
      'Generate insights about {entity}'
    ]);

    this.templates.set('navigate', [
      'Go to {location}',
      'Navigate to {path}',
      'Switch to {registry}',
      'Open {entity}'
    ]);

    this.templates.set('configure', [
      'Configure {setting} to {value}',
      'Set {setting} preferences',
      'Change system settings',
      'Update configuration'
    ]);

    this.templates.set('help', [
      'Help with {topic}',
      'Show information about {entity}',
      'Get assistance with {task}',
      'Explain how to {action}'
    ]);
  }

  generatePrompt(intent: Intent, entities: Entity[], context?: ContextData): string {
    const templates = this.templates.get(intent) || ['{text}'];
    const template = templates[Math.floor(Math.random() * templates.length)];

    let prompt = template;

    // Replace placeholders with entity values
    entities.forEach(entity => {
      const placeholder = `{${entity.type}}`;
      if (prompt.includes(placeholder)) {
        prompt = prompt.replace(placeholder, entity.value);
      }
    });

    // Add context information
    if (context) {
      if (context.currentPath) {
        prompt += ` (current path: ${context.currentPath})`;
      }
      if (context.activeRegistries.length > 0) {
        prompt += ` (active registries: ${context.activeRegistries.join(', ')})`;
      }
    }

    return prompt;
  }

  getAvailableTemplates(intent: Intent): string[] {
    return this.templates.get(intent) || [];
  }

  addTemplate(intent: Intent, template: string): void {
    if (!this.templates.has(intent)) {
      this.templates.set(intent, []);
    }
    this.templates.get(intent)!.push(template);
  }
}

export class IntentClassifier {
  private keywordMappings: Map<Intent, string[]> = new Map();

  constructor() {
    this.initializeKeywordMappings();
  }

  private initializeKeywordMappings() {
    this.keywordMappings.set('search', [
      'find', 'search', 'lookup', 'query', 'get', 'show', 'display', 'list'
    ]);

    this.keywordMappings.set('create', [
      'create', 'add', 'new', 'register', 'insert', 'make'
    ]);

    this.keywordMappings.set('update', [
      'update', 'modify', 'change', 'edit', 'alter', 'set'
    ]);

    this.keywordMappings.set('delete', [
      'delete', 'remove', 'erase', 'destroy', 'unregister'
    ]);

    this.keywordMappings.set('analyze', [
      'analyze', 'statistics', 'stats', 'examine', 'study', 'review'
    ]);

    this.keywordMappings.set('generate', [
      'generate', 'create', 'produce', 'make', 'build', 'report'
    ]);

    this.keywordMappings.set('navigate', [
      'go', 'navigate', 'switch', 'open', 'enter', 'visit'
    ]);

    this.keywordMappings.set('configure', [
      'configure', 'config', 'settings', 'preferences', 'setup'
    ]);

    this.keywordMappings.set('help', [
      'help', 'assist', 'guide', 'explain', 'info', 'about'
    ]);

    this.keywordMappings.set('list', [
      'list', 'show all', 'display all', 'enumerate'
    ]);

    this.keywordMappings.set('describe', [
      'describe', 'explain', 'detail', 'information'
    ]);

    this.keywordMappings.set('compare', [
      'compare', 'contrast', 'versus', 'vs', 'difference'
    ]);
  }

  classifyIntent(text: string): { intent: Intent; confidence: number } {
    const lowerText = text.toLowerCase();
    const scores = new Map<Intent, number>();

    // Calculate scores based on keyword matches
    this.keywordMappings.forEach((keywords, intent) => {
      let score = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      scores.set(intent, score);
    });

    // Find the intent with the highest score
    let maxScore = 0;
    let bestIntent: Intent = 'search';

    scores.forEach((score, intent) => {
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    });

    // Normalize confidence (simple approach)
    const totalWords = lowerText.split(/\s+/).length;
    const confidence = maxScore > 0 ? Math.min(maxScore / totalWords, 1) : 0.1;

    return { intent: bestIntent, confidence };
  }
}

export class EntityExtractor {
  private entityPatterns: Map<Entity['type'], RegExp[]> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Registry patterns
    this.entityPatterns.set('registry', [
      /\b(registry|repo|repository)\b/gi,
      /\b[a-zA-Z0-9_-]+\b(?=\s+registry)/gi
    ]);

    // Entry patterns
    this.entityPatterns.set('entry', [
      /\b(entry|item|record)\b/gi,
      /\b[a-zA-Z0-9_-]+\b(?=\s+entry)/gi
    ]);

    // Tag patterns
    this.entityPatterns.set('tag', [
      /#(?<tag>[a-zA-Z0-9_-]+)/gi,
      /\btag\s+(?<tag>[a-zA-Z0-9_-]+)/gi
    ]);

    // User patterns
    this.entityPatterns.set('user', [
      /\b(user|person|account)\s+(?<user>[a-zA-Z0-9_-]+)/gi,
      /@(?<user>[a-zA-Z0-9_-]+)/gi
    ]);

    // Command patterns
    this.entityPatterns.set('command', [
      /\b(command|cmd|action)\s+(?<cmd>[a-zA-Z0-9_-]+)/gi,
      /\b(run|execute)\s+(?<cmd>[a-zA-Z0-9_-]+)/gi
    ]);

    // Path patterns
    this.entityPatterns.set('path', [
      /(?<path>\/[^\s]+)/gi,
      /(?<path>\.[^\s]+)/gi,
      /(?<path>[a-zA-Z]:[^\s]+)/gi
    ]);

    // URL patterns
    this.entityPatterns.set('url', [
      /(?<url>https?:\/\/[^\s]+)/gi,
      /(?<url>www\.[^\s]+)/gi
    ]);
  }

  extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];

    this.entityPatterns.forEach((patterns, type) => {
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const value = match.groups?.[type] || match[0];
          const confidence = this.calculateConfidence(type, value, text);

          entities.push({
            type,
            value,
            confidence,
            start: match.index,
            end: match.index + match[0].length
          });
        }
      });
    });

    // Remove duplicates and overlapping entities
    return this.deduplicateEntities(entities);
  }

  private calculateConfidence(type: Entity['type'], value: string, text: string): number {
    // Simple confidence calculation based on context and format
    let confidence = 0.5;

    switch (type) {
      case 'url':
        confidence = value.startsWith('http') ? 0.9 : 0.7;
        break;
      case 'path':
        confidence = (value.includes('/') || value.includes('\\')) ? 0.8 : 0.6;
        break;
      case 'tag':
        confidence = value.startsWith('#') ? 0.9 : 0.7;
        break;
      case 'user':
        confidence = value.startsWith('@') ? 0.9 : 0.7;
        break;
      default:
        confidence = 0.6;
    }

    return confidence;
  }

  private deduplicateEntities(entities: Entity[]): Entity[] {
    const deduplicated: Entity[] = [];

    entities.forEach(entity => {
      const overlapping = deduplicated.find(existing =>
        existing.start < entity.end && existing.end > entity.start
      );

      if (!overlapping) {
        deduplicated.push(entity);
      } else if (entity.confidence > overlapping.confidence) {
        // Replace with higher confidence entity
        const index = deduplicated.indexOf(overlapping);
        deduplicated[index] = entity;
      }
    });

    return deduplicated;
  }
}

export class SentimentAnalyzer {
  private positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'awesome', 'brilliant', 'perfect', 'love', 'like', 'happy', 'pleased'
  ]);

  private negativeWords = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry',
    'frustrated', 'annoyed', 'disappointed', 'poor', 'wrong', 'fail'
  ]);

  analyze(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (this.positiveWords.has(word)) positiveScore++;
      if (this.negativeWords.has(word)) negativeScore++;
    });

    const totalSentimentWords = positiveScore + negativeScore;
    if (totalSentimentWords === 0) {
      return { sentiment: 'neutral', score: 0 };
    }

    const netScore = (positiveScore - negativeScore) / totalSentimentWords;

    let sentiment: 'positive' | 'negative' | 'neutral';
    if (netScore > 0.1) sentiment = 'positive';
    else if (netScore < -0.1) sentiment = 'neutral';
    else sentiment = 'neutral';

    return { sentiment, score: netScore };
  }
}

export class NLPProcessor {
  private intentClassifier: IntentClassifier;
  private entityExtractor: EntityExtractor;
  private sentimentAnalyzer: SentimentAnalyzer;
  private promptEngineer: PromptEngineer;
  private contextManager: ContextManager;

  constructor() {
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.promptEngineer = new PromptEngineer();
    this.contextManager = new ContextManager();
  }

  async analyze(text: string, contextData?: Partial<ContextData>): Promise<NLPAnalysis> {
    // Create or update context
    const currentContext = this.contextManager.getCurrentContext();
    const context: ContextData = {
      sessionId: contextData?.sessionId || currentContext?.sessionId || 'default',
      timestamp: new Date(),
      previousIntents: currentContext?.previousIntents || [],
      currentPath: contextData?.currentPath || currentContext?.currentPath,
      activeRegistries: contextData?.activeRegistries || currentContext?.activeRegistries || [],
      userPreferences: contextData?.userPreferences || currentContext?.userPreferences
    };

    // Classify intent
    const { intent, confidence } = this.intentClassifier.classifyIntent(text);

    // Extract entities
    const entities = this.entityExtractor.extractEntities(text);

    // Analyze sentiment
    const { sentiment } = this.sentimentAnalyzer.analyze(text);

    // Determine urgency based on sentiment and keywords
    const urgency = this.determineUrgency(text, sentiment);

    // Generate suggestions
    const suggestions = this.generateSuggestions(intent, entities, context);

    // Update context with new intent
    context.previousIntents.push(intent);
    this.contextManager.addContext(context);

    const analysis: NLPAnalysis = {
      text,
      intent,
      confidence,
      entities,
      sentiment,
      urgency,
      context,
      suggestions
    };

    return analysis;
  }

  private determineUrgency(text: string, sentiment: string): 'low' | 'medium' | 'high' {
    const lowerText = text.toLowerCase();

    // High urgency keywords
    if (lowerText.includes('urgent') || lowerText.includes('emergency') ||
        lowerText.includes('critical') || lowerText.includes('asap')) {
      return 'high';
    }

    // Medium urgency based on sentiment
    if (sentiment === 'negative' ||
        lowerText.includes('problem') || lowerText.includes('issue') ||
        lowerText.includes('error') || lowerText.includes('bug')) {
      return 'medium';
    }

    return 'low';
  }

  private generateSuggestions(intent: Intent, entities: Entity[], context: ContextData): string[] {
    const suggestions: string[] = [];

    switch (intent) {
      case 'search':
        suggestions.push('Try using specific tags for better results');
        suggestions.push('Use filters to narrow down your search');
        break;
      case 'create':
        suggestions.push('Add relevant tags to help with discovery');
        suggestions.push('Include a detailed description');
        break;
      case 'help':
        suggestions.push('Check the documentation for detailed guides');
        suggestions.push('Use the search feature to find related topics');
        break;
      default:
        suggestions.push('Use natural language for better understanding');
    }

    return suggestions;
  }

  getContextManager(): ContextManager {
    return this.contextManager;
  }

  getPromptEngineer(): PromptEngineer {
    return this.promptEngineer;
  }

  // Method to enhance analysis with machine learning models (placeholder)
  async enhanceWithML(analysis: NLPAnalysis): Promise<NLPAnalysis> {
    // This would integrate with actual ML models for better accuracy
    // For now, return the analysis as-is
    return analysis;
  }
}