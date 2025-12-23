import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { z } from 'zod';

// RAG (Retrieval-Augmented Generation) Context System
export const ContextChunkSchema = z.object({
  id: z.string(),
  content: z.string(),
  metadata: z.record(z.any()),
  embedding: z.array(z.number()),
  score: z.number().optional(),
  timestamp: z.date(),
  source: z.string(),
  tags: z.array(z.string()),
  relationships: z.array(z.string()) // IDs of related chunks
});

export type ContextChunk = z.infer<typeof ContextChunkSchema>;

export const QuerySchema = z.object({
  text: z.string(),
  intent: z.enum(['search', 'create', 'update', 'delete', 'analyze', 'generate']),
  context: z.record(z.any()),
  filters: z.record(z.any()).optional(),
  limit: z.number().default(10),
  threshold: z.number().default(0.7)
});

export type Query = z.infer<typeof QuerySchema>;

export const RetrievalResultSchema = z.object({
  chunks: z.array(ContextChunkSchema),
  query: QuerySchema,
  totalFound: z.number(),
  processingTime: z.number(),
  confidence: z.number()
});

export type RetrievalResult = z.infer<typeof RetrievalResultSchema>;

export const GenerationContextSchema = z.object({
  query: QuerySchema,
  retrievedChunks: z.array(ContextChunkSchema),
  systemPrompt: z.string(),
  temperature: z.number().default(0.7),
  maxTokens: z.number().default(1000),
  contextWindow: z.number().default(4096)
});

export type GenerationContext = z.infer<typeof GenerationContextSchema>;

export class EmbeddingEngine {
  private dimensions: number = 384; // Common embedding dimension

  async generateEmbedding(text: string): Promise<number[]> {
    // Mock embedding generation - in real implementation, use actual ML model
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(this.dimensions).fill(0);

    // Simple hash-based embedding for demo
    words.forEach((word, wordIndex) => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
      }

      const position = Math.abs(hash) % this.dimensions;
      embedding[position] += 1;
    });

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
  }
}

export class ContextChunkManager {
  private chunks: Map<string, ContextChunk> = new Map();

  addChunk(chunk: ContextChunk): void {
    this.chunks.set(chunk.id, chunk);
  }

  getChunk(id: string): ContextChunk | undefined {
    return this.chunks.get(id);
  }

  getAllChunks(): ContextChunk[] {
    return Array.from(this.chunks.values());
  }

  removeChunk(id: string): boolean {
    return this.chunks.delete(id);
  }

  searchByTags(tags: string[]): ContextChunk[] {
    return this.getAllChunks().filter(chunk =>
      tags.every(tag => chunk.tags.includes(tag))
    );
  }

  searchBySource(source: string): ContextChunk[] {
    return this.getAllChunks().filter(chunk => chunk.source === source);
  }

  getRelatedChunks(chunkId: string): ContextChunk[] {
    const chunk = this.getChunk(chunkId);
    if (!chunk) return [];

    return chunk.relationships
      .map(id => this.getChunk(id))
      .filter((c): c is ContextChunk => c !== undefined);
  }
}

export class RetrievalEngine {
  private embeddingEngine: EmbeddingEngine;
  private chunkManager: ContextChunkManager;

  constructor(embeddingEngine: EmbeddingEngine, chunkManager: ContextChunkManager) {
    this.embeddingEngine = embeddingEngine;
    this.chunkManager = chunkManager;
  }

  async retrieve(query: Query): Promise<RetrievalResult> {
    const startTime = Date.now();

    // Generate query embedding
    const queryEmbedding = await this.embeddingEngine.generateEmbedding(query.text);

    // Get all chunks and calculate similarities
    const allChunks = this.chunkManager.getAllChunks();
    const scoredChunks = await Promise.all(
      allChunks.map(async (chunk) => {
        const chunkEmbedding = await this.embeddingEngine.generateEmbedding(chunk.content);
        const similarity = this.embeddingEngine.calculateSimilarity(queryEmbedding, chunkEmbedding);

        return {
          ...chunk,
          score: similarity
        };
      })
    );

    // Sort by score descending
    scoredChunks.sort((a, b) => b.score - a.score);

    // Apply filters
    let filteredChunks: ContextChunk[] = scoredChunks;
    if (query.filters) {
      filteredChunks = this.applyFilters(scoredChunks, query.filters) as ContextChunk[];
    }

    // Apply limit
    const resultChunks = filteredChunks.slice(0, query.limit);

    const processingTime = Date.now() - startTime;
    const confidence = resultChunks.length > 0 ? resultChunks[0].score || 0 : 0;

    return {
      chunks: resultChunks,
      query,
      totalFound: filteredChunks.length,
      processingTime,
      confidence
    };
  }

  private applyFilters(chunks: (ContextChunk & { score?: number })[], filters: Record<string, any>): (ContextChunk & { score?: number })[] {
    return chunks.filter(chunk => {
      for (const [key, value] of Object.entries(filters)) {
        if (key === 'tags') {
          if (!Array.isArray(value)) continue;
          if (!value.every((tag: string) => chunk.tags.includes(tag))) return false;
        } else if (key === 'source') {
          if (chunk.source !== value) return false;
        } else if (key === 'dateRange') {
          const { start, end } = value;
          if (start && chunk.timestamp < new Date(start)) return false;
          if (end && chunk.timestamp > new Date(end)) return false;
        } else if (chunk.metadata[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
}

export class GenerationEngine {
  async generate(context: GenerationContext): Promise<string> {
    // Mock generation - in real implementation, use actual LLM
    const relevantContent = context.retrievedChunks
      .map(chunk => chunk.content)
      .join('\n\n');

    const prompt = `${context.systemPrompt}\n\nContext:\n${relevantContent}\n\nQuery: ${context.query.text}\n\nResponse:`;

    // Simple mock response based on intent
    switch (context.query.intent) {
      case 'search':
        return `Based on the available context, here's what I found related to "${context.query.text}": ${relevantContent.substring(0, 200)}...`;
      case 'analyze':
        return `Analysis of "${context.query.text}": The context suggests ${context.retrievedChunks.length} relevant pieces of information...`;
      case 'generate':
        return `Generated content for "${context.query.text}": Here's a comprehensive response based on the context...`;
      default:
        return `Response to "${context.query.text}": ${relevantContent.substring(0, 150)}...`;
    }
  }
}

export class RAGPipeline {
  private embeddingEngine: EmbeddingEngine;
  private chunkManager: ContextChunkManager;
  private retrievalEngine: RetrievalEngine;
  private generationEngine: GenerationEngine;

  constructor() {
    this.embeddingEngine = new EmbeddingEngine();
    this.chunkManager = new ContextChunkManager();
    this.retrievalEngine = new RetrievalEngine(this.embeddingEngine, this.chunkManager);
    this.generationEngine = new GenerationEngine();
  }

  async addContext(content: string, metadata: Record<string, any> = {}, tags: string[] = [], source: string = 'unknown'): Promise<string> {
    const id = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const embedding = await this.embeddingEngine.generateEmbedding(content);

    const chunk: ContextChunk = {
      id,
      content,
      metadata,
      embedding,
      timestamp: new Date(),
      source,
      tags,
      relationships: []
    };

    this.chunkManager.addChunk(chunk);
    return id;
  }

  async query(text: string, intent: Query['intent'] = 'search', context: Record<string, any> = {}, options: Partial<Query> = {}): Promise<string> {
    const query: Query = {
      text,
      intent,
      context,
      limit: options.limit || 5,
      threshold: options.threshold || 0.5,
      filters: options.filters
    };

    const retrievalResult = await this.retrievalEngine.retrieve(query);

    const generationContext: GenerationContext = {
      query,
      retrievedChunks: retrievalResult.chunks,
      systemPrompt: 'You are a helpful AI assistant with access to a knowledge base. Use the provided context to answer questions accurately.',
      temperature: 0.7,
      maxTokens: 500,
      contextWindow: 4096
    };

    return await this.generationEngine.generate(generationContext);
  }

  getStats(): { totalChunks: number; sources: string[]; tags: string[] } {
    const chunks = this.chunkManager.getAllChunks();
    const sources = [...new Set(chunks.map(c => c.source))];
    const tags = [...new Set(chunks.flatMap(c => c.tags))];

    return {
      totalChunks: chunks.length,
      sources,
      tags
    };
  }
}

// React Interface Component
export const RAGInterface: React.FC<{
  pipeline: RAGPipeline;
  onQuery: (query: string, response: string) => void;
}> = ({ pipeline, onQuery }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await pipeline.query(query);
      setResponse(result);
      onQuery(query, result);
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = pipeline.getStats();

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">RAG Context System</Text>

      <Box marginY={1}>
        <Text dimColor>Knowledge Base Stats:</Text>
        <Text> • {stats.totalChunks} chunks</Text>
        <Text> • {stats.sources.length} sources</Text>
        <Text> • {stats.tags.length} tags</Text>
      </Box>

      <Box flexDirection="column" marginY={1}>
        <Text>Query: {query}</Text>
        <Text dimColor>Press Enter to search context...</Text>
      </Box>

      {isLoading && (
        <Box marginY={1}>
          <Text color="yellow">Processing query...</Text>
        </Box>
      )}

      {response && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="green">Response:</Text>
          <Text>{response}</Text>
        </Box>
      )}
    </Box>
  );
};