import { z } from 'zod';
export declare const NodeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["registry", "entry", "relationship", "metadata", "system"]>;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "registry" | "entry" | "relationship" | "metadata" | "system";
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    type: "registry" | "entry" | "relationship" | "metadata" | "system";
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any> | undefined;
}>;
export type Node = z.infer<typeof NodeSchema>;
export declare const EdgeSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    type: z.ZodEnum<["depends_on", "references", "contains", "belongs_to", "related_to", "extends"]>;
    weight: z.ZodDefault<z.ZodNumber>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
    createdAt: Date;
    sourceId: string;
    targetId: string;
    weight: number;
    data?: Record<string, any> | undefined;
}, {
    id: string;
    type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
    createdAt: Date;
    sourceId: string;
    targetId: string;
    data?: Record<string, any> | undefined;
    weight?: number | undefined;
}>;
export type Edge = z.infer<typeof EdgeSchema>;
export declare const DAGSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["registry", "entry", "relationship", "metadata", "system"]>;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "registry" | "entry" | "relationship" | "metadata" | "system";
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        metadata?: Record<string, any> | undefined;
    }, {
        id: string;
        type: "registry" | "entry" | "relationship" | "metadata" | "system";
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        type: z.ZodEnum<["depends_on", "references", "contains", "belongs_to", "related_to", "extends"]>;
        weight: z.ZodDefault<z.ZodNumber>;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
        createdAt: Date;
        sourceId: string;
        targetId: string;
        weight: number;
        data?: Record<string, any> | undefined;
    }, {
        id: string;
        type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
        createdAt: Date;
        sourceId: string;
        targetId: string;
        data?: Record<string, any> | undefined;
        weight?: number | undefined;
    }>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    nodes: {
        id: string;
        type: "registry" | "entry" | "relationship" | "metadata" | "system";
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        metadata?: Record<string, any> | undefined;
    }[];
    edges: {
        id: string;
        type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
        createdAt: Date;
        sourceId: string;
        targetId: string;
        weight: number;
        data?: Record<string, any> | undefined;
    }[];
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    nodes: {
        id: string;
        type: "registry" | "entry" | "relationship" | "metadata" | "system";
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        metadata?: Record<string, any> | undefined;
    }[];
    edges: {
        id: string;
        type: "depends_on" | "references" | "contains" | "belongs_to" | "related_to" | "extends";
        createdAt: Date;
        sourceId: string;
        targetId: string;
        data?: Record<string, any> | undefined;
        weight?: number | undefined;
    }[];
    metadata?: Record<string, any> | undefined;
}>;
export type DAG = z.infer<typeof DAGSchema>;
export declare class DirectedAcyclicGraph {
    private nodes;
    private edges;
    private adjacencyList;
    private reverseAdjacencyList;
    constructor(id?: string, name?: string);
    id: string;
    name: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    addNode(node: Node): boolean;
    removeNode(nodeId: string): boolean;
    addEdge(edge: Edge): boolean;
    removeEdge(edgeId: string): boolean;
    private wouldCreateCycle;
    getNode(nodeId: string): Node | undefined;
    getEdge(edgeId: string): Edge | undefined;
    getAllNodes(): Node[];
    getAllEdges(): Edge[];
    getNeighbors(nodeId: string): string[];
    getParents(nodeId: string): string[];
    getChildren(nodeId: string): string[];
    topologicalSort(): string[];
    getShortestPath(startId: string, endId: string): string[] | null;
    getConnectedComponents(): string[][];
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    toJSON(): DAG;
    static fromJSON(data: DAG): DirectedAcyclicGraph;
}
export declare class RetrievalAugmentedGenerator {
    private dag;
    private embeddingEngine;
    constructor(dag: DirectedAcyclicGraph);
    retrieve(query: string, limit?: number): Promise<Node[]>;
    generateResponse(query: string, context: Node[]): Promise<string>;
    query(query: string): Promise<string>;
}
//# sourceMappingURL=dag-engine.d.ts.map