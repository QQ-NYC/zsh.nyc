import { z } from 'zod';
export declare const IntentSchema: z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate", "navigate", "configure", "help", "list", "describe", "compare"]>;
export type Intent = z.infer<typeof IntentSchema>;
export declare const EntitySchema: z.ZodObject<{
    type: z.ZodEnum<["registry", "entry", "tag", "user", "system", "command", "path", "url"]>;
    value: z.ZodString;
    confidence: z.ZodNumber;
    start: z.ZodNumber;
    end: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
    value: string;
    confidence: number;
    start: number;
    end: number;
    metadata?: Record<string, any> | undefined;
}, {
    type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
    value: string;
    confidence: number;
    start: number;
    end: number;
    metadata?: Record<string, any> | undefined;
}>;
export type Entity = z.infer<typeof EntitySchema>;
export declare const ContextDataSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodString;
    timestamp: z.ZodDate;
    previousIntents: z.ZodArray<z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate", "navigate", "configure", "help", "list", "describe", "compare"]>, "many">;
    currentPath: z.ZodOptional<z.ZodString>;
    activeRegistries: z.ZodArray<z.ZodString, "many">;
    userPreferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    timestamp: Date;
    previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
    activeRegistries: string[];
    userId?: string | undefined;
    currentPath?: string | undefined;
    userPreferences?: Record<string, any> | undefined;
}, {
    sessionId: string;
    timestamp: Date;
    previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
    activeRegistries: string[];
    userId?: string | undefined;
    currentPath?: string | undefined;
    userPreferences?: Record<string, any> | undefined;
}>;
export type ContextData = z.infer<typeof ContextDataSchema>;
export declare const NLPAnalysisSchema: z.ZodObject<{
    text: z.ZodString;
    intent: z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate", "navigate", "configure", "help", "list", "describe", "compare"]>;
    confidence: z.ZodNumber;
    entities: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["registry", "entry", "tag", "user", "system", "command", "path", "url"]>;
        value: z.ZodString;
        confidence: z.ZodNumber;
        start: z.ZodNumber;
        end: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
        value: string;
        confidence: number;
        start: number;
        end: number;
        metadata?: Record<string, any> | undefined;
    }, {
        type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
        value: string;
        confidence: number;
        start: number;
        end: number;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
    sentiment: z.ZodEnum<["positive", "negative", "neutral"]>;
    urgency: z.ZodEnum<["low", "medium", "high"]>;
    context: z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
        sessionId: z.ZodString;
        timestamp: z.ZodDate;
        previousIntents: z.ZodArray<z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate", "navigate", "configure", "help", "list", "describe", "compare"]>, "many">;
        currentPath: z.ZodOptional<z.ZodString>;
        activeRegistries: z.ZodArray<z.ZodString, "many">;
        userPreferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        timestamp: Date;
        previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
        activeRegistries: string[];
        userId?: string | undefined;
        currentPath?: string | undefined;
        userPreferences?: Record<string, any> | undefined;
    }, {
        sessionId: string;
        timestamp: Date;
        previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
        activeRegistries: string[];
        userId?: string | undefined;
        currentPath?: string | undefined;
        userPreferences?: Record<string, any> | undefined;
    }>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    text: string;
    intent: "search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare";
    entities: {
        type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
        value: string;
        confidence: number;
        start: number;
        end: number;
        metadata?: Record<string, any> | undefined;
    }[];
    sentiment: "positive" | "negative" | "neutral";
    urgency: "low" | "medium" | "high";
    context: {
        sessionId: string;
        timestamp: Date;
        previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
        activeRegistries: string[];
        userId?: string | undefined;
        currentPath?: string | undefined;
        userPreferences?: Record<string, any> | undefined;
    };
    suggestions?: string[] | undefined;
}, {
    confidence: number;
    text: string;
    intent: "search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare";
    entities: {
        type: "path" | "registry" | "entry" | "system" | "tag" | "user" | "command" | "url";
        value: string;
        confidence: number;
        start: number;
        end: number;
        metadata?: Record<string, any> | undefined;
    }[];
    sentiment: "positive" | "negative" | "neutral";
    urgency: "low" | "medium" | "high";
    context: {
        sessionId: string;
        timestamp: Date;
        previousIntents: ("search" | "create" | "update" | "delete" | "analyze" | "generate" | "navigate" | "configure" | "help" | "list" | "describe" | "compare")[];
        activeRegistries: string[];
        userId?: string | undefined;
        currentPath?: string | undefined;
        userPreferences?: Record<string, any> | undefined;
    };
    suggestions?: string[] | undefined;
}>;
export type NLPAnalysis = z.infer<typeof NLPAnalysisSchema>;
export declare class ContextManager {
    private contextHistory;
    private maxHistorySize;
    addContext(context: ContextData): void;
    getCurrentContext(): ContextData | null;
    getContextHistory(): ContextData[];
    clearHistory(): void;
    getRecentIntents(count?: number): Intent[];
    updateContext(updates: Partial<ContextData>): void;
}
export declare class PromptEngineer {
    private templates;
    constructor();
    private initializeTemplates;
    generatePrompt(intent: Intent, entities: Entity[], context?: ContextData): string;
    getAvailableTemplates(intent: Intent): string[];
    addTemplate(intent: Intent, template: string): void;
}
export declare class IntentClassifier {
    private keywordMappings;
    constructor();
    private initializeKeywordMappings;
    classifyIntent(text: string): {
        intent: Intent;
        confidence: number;
    };
}
export declare class EntityExtractor {
    private entityPatterns;
    constructor();
    private initializePatterns;
    extractEntities(text: string): Entity[];
    private calculateConfidence;
    private deduplicateEntities;
}
export declare class SentimentAnalyzer {
    private positiveWords;
    private negativeWords;
    analyze(text: string): {
        sentiment: 'positive' | 'negative' | 'neutral';
        score: number;
    };
}
export declare class NLPProcessor {
    private intentClassifier;
    private entityExtractor;
    private sentimentAnalyzer;
    private promptEngineer;
    private contextManager;
    constructor();
    analyze(text: string, contextData?: Partial<ContextData>): Promise<NLPAnalysis>;
    private determineUrgency;
    private generateSuggestions;
    getContextManager(): ContextManager;
    getPromptEngineer(): PromptEngineer;
    enhanceWithML(analysis: NLPAnalysis): Promise<NLPAnalysis>;
}
//# sourceMappingURL=nlp-processor.d.ts.map