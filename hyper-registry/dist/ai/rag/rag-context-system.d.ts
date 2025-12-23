import React from 'react';
import { z } from 'zod';
export declare const ContextChunkSchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodAny>;
    embedding: z.ZodArray<z.ZodNumber, "many">;
    score: z.ZodOptional<z.ZodNumber>;
    timestamp: z.ZodDate;
    source: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    relationships: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    metadata: Record<string, any>;
    timestamp: Date;
    content: string;
    embedding: number[];
    source: string;
    tags: string[];
    relationships: string[];
    score?: number | undefined;
}, {
    id: string;
    metadata: Record<string, any>;
    timestamp: Date;
    content: string;
    embedding: number[];
    source: string;
    tags: string[];
    relationships: string[];
    score?: number | undefined;
}>;
export type ContextChunk = z.infer<typeof ContextChunkSchema>;
export declare const QuerySchema: z.ZodObject<{
    text: z.ZodString;
    intent: z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate"]>;
    context: z.ZodRecord<z.ZodString, z.ZodAny>;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    limit: z.ZodDefault<z.ZodNumber>;
    threshold: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    text: string;
    intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
    context: Record<string, any>;
    limit: number;
    threshold: number;
    filters?: Record<string, any> | undefined;
}, {
    text: string;
    intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
    context: Record<string, any>;
    filters?: Record<string, any> | undefined;
    limit?: number | undefined;
    threshold?: number | undefined;
}>;
export type Query = z.infer<typeof QuerySchema>;
export declare const RetrievalResultSchema: z.ZodObject<{
    chunks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        metadata: z.ZodRecord<z.ZodString, z.ZodAny>;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        timestamp: z.ZodDate;
        source: z.ZodString;
        tags: z.ZodArray<z.ZodString, "many">;
        relationships: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }, {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }>, "many">;
    query: z.ZodObject<{
        text: z.ZodString;
        intent: z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate"]>;
        context: z.ZodRecord<z.ZodString, z.ZodAny>;
        filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        limit: z.ZodDefault<z.ZodNumber>;
        threshold: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        limit: number;
        threshold: number;
        filters?: Record<string, any> | undefined;
    }, {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        filters?: Record<string, any> | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    }>;
    totalFound: z.ZodNumber;
    processingTime: z.ZodNumber;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    query: {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        limit: number;
        threshold: number;
        filters?: Record<string, any> | undefined;
    };
    chunks: {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }[];
    totalFound: number;
    processingTime: number;
}, {
    confidence: number;
    query: {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        filters?: Record<string, any> | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    };
    chunks: {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }[];
    totalFound: number;
    processingTime: number;
}>;
export type RetrievalResult = z.infer<typeof RetrievalResultSchema>;
export declare const GenerationContextSchema: z.ZodObject<{
    query: z.ZodObject<{
        text: z.ZodString;
        intent: z.ZodEnum<["search", "create", "update", "delete", "analyze", "generate"]>;
        context: z.ZodRecord<z.ZodString, z.ZodAny>;
        filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        limit: z.ZodDefault<z.ZodNumber>;
        threshold: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        limit: number;
        threshold: number;
        filters?: Record<string, any> | undefined;
    }, {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        filters?: Record<string, any> | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    }>;
    retrievedChunks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        metadata: z.ZodRecord<z.ZodString, z.ZodAny>;
        embedding: z.ZodArray<z.ZodNumber, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        timestamp: z.ZodDate;
        source: z.ZodString;
        tags: z.ZodArray<z.ZodString, "many">;
        relationships: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }, {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }>, "many">;
    systemPrompt: z.ZodString;
    temperature: z.ZodDefault<z.ZodNumber>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    contextWindow: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query: {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        limit: number;
        threshold: number;
        filters?: Record<string, any> | undefined;
    };
    retrievedChunks: {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }[];
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    contextWindow: number;
}, {
    query: {
        text: string;
        intent: "search" | "create" | "update" | "delete" | "analyze" | "generate";
        context: Record<string, any>;
        filters?: Record<string, any> | undefined;
        limit?: number | undefined;
        threshold?: number | undefined;
    };
    retrievedChunks: {
        id: string;
        metadata: Record<string, any>;
        timestamp: Date;
        content: string;
        embedding: number[];
        source: string;
        tags: string[];
        relationships: string[];
        score?: number | undefined;
    }[];
    systemPrompt: string;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    contextWindow?: number | undefined;
}>;
export type GenerationContext = z.infer<typeof GenerationContextSchema>;
export declare class EmbeddingEngine {
    private dimensions;
    generateEmbedding(text: string): Promise<number[]>;
    calculateSimilarity(embedding1: number[], embedding2: number[]): number;
}
export declare class ContextChunkManager {
    private chunks;
    addChunk(chunk: ContextChunk): void;
    getChunk(id: string): ContextChunk | undefined;
    getAllChunks(): ContextChunk[];
    removeChunk(id: string): boolean;
    searchByTags(tags: string[]): ContextChunk[];
    searchBySource(source: string): ContextChunk[];
    getRelatedChunks(chunkId: string): ContextChunk[];
}
export declare class RetrievalEngine {
    private embeddingEngine;
    private chunkManager;
    constructor(embeddingEngine: EmbeddingEngine, chunkManager: ContextChunkManager);
    retrieve(query: Query): Promise<RetrievalResult>;
    private applyFilters;
}
export declare class GenerationEngine {
    generate(context: GenerationContext): Promise<string>;
}
export declare class RAGPipeline {
    private embeddingEngine;
    private chunkManager;
    private retrievalEngine;
    private generationEngine;
    constructor();
    addContext(content: string, metadata?: Record<string, any>, tags?: string[], source?: string): Promise<string>;
    query(text: string, intent?: Query['intent'], context?: Record<string, any>, options?: Partial<Query>): Promise<string>;
    getStats(): {
        totalChunks: number;
        sources: string[];
        tags: string[];
    };
}
export declare const RAGInterface: React.FC<{
    pipeline: RAGPipeline;
    onQuery: (query: string, response: string) => void;
}>;
//# sourceMappingURL=rag-context-system.d.ts.map