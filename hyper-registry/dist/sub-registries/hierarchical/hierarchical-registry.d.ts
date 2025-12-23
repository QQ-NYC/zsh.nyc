import { z } from 'zod';
export declare const RegistryTypeSchema: z.ZodEnum<["domain", "federated", "personal", "system", "custom"]>;
export type RegistryType = z.infer<typeof RegistryTypeSchema>;
export declare const RegistryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    tags: z.ZodArray<z.ZodString, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    version: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    tags: string[];
    description: string;
    version: number;
    metadata?: Record<string, any> | undefined;
}, {
    id: string;
    type: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    tags: string[];
    description: string;
    metadata?: Record<string, any> | undefined;
    version?: number | undefined;
}>;
export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;
export declare const RegistryNodeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["domain", "federated", "personal", "system", "custom"]>;
    description: z.ZodString;
    parentId: z.ZodNullable<z.ZodString>;
    children: z.ZodArray<z.ZodString, "many">;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodString;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        tags: z.ZodArray<z.ZodString, "many">;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        version: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: string;
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: string[];
        description: string;
        version: number;
        metadata?: Record<string, any> | undefined;
    }, {
        id: string;
        type: string;
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: string[];
        description: string;
        metadata?: Record<string, any> | undefined;
        version?: number | undefined;
    }>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    children: string[];
    id: string;
    type: "custom" | "system" | "domain" | "federated" | "personal";
    entries: {
        id: string;
        type: string;
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: string[];
        description: string;
        version: number;
        metadata?: Record<string, any> | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    parentId: string | null;
    metadata?: Record<string, any> | undefined;
    permissions?: Record<string, any> | undefined;
}, {
    children: string[];
    id: string;
    type: "custom" | "system" | "domain" | "federated" | "personal";
    entries: {
        id: string;
        type: string;
        data: Record<string, any>;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tags: string[];
        description: string;
        metadata?: Record<string, any> | undefined;
        version?: number | undefined;
    }[];
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    parentId: string | null;
    metadata?: Record<string, any> | undefined;
    permissions?: Record<string, any> | undefined;
}>;
export type RegistryNode = z.infer<typeof RegistryNodeSchema>;
export declare class RegistryNodeManager {
    private node;
    private childManagers;
    constructor(node: RegistryNode);
    getNode(): RegistryNode;
    addEntry(entry: RegistryEntry): boolean;
    removeEntry(entryId: string): boolean;
    updateEntry(entryId: string, updates: Partial<RegistryEntry>): boolean;
    getEntry(entryId: string): RegistryEntry | undefined;
    getAllEntries(): RegistryEntry[];
    searchEntries(query: string): RegistryEntry[];
    addChild(childManager: RegistryNodeManager): boolean;
    removeChild(childId: string): boolean;
    getChild(childId: string): RegistryNodeManager | undefined;
    getAllChildren(): RegistryNodeManager[];
    getChildIds(): string[];
    searchHierarchy(query: string): RegistryEntry[];
    getStats(): {
        totalEntries: number;
        totalChildren: number;
        entryTypes: Record<string, number>;
        lastUpdated: Date;
    };
}
export declare class HierarchicalRegistryManager {
    private rootManagers;
    private nodeIndex;
    createRegistry(id: string, name: string, type: RegistryType, description: string, parentId?: string | null): RegistryNodeManager | null;
    getRegistry(registryId: string): RegistryNodeManager | undefined;
    removeRegistry(registryId: string): boolean;
    getRootRegistries(): RegistryNodeManager[];
    getAllRegistries(): RegistryNodeManager[];
    searchAllRegistries(query: string): RegistryEntry[];
    findRegistryByPath(path: string): RegistryNodeManager | null;
    moveRegistry(registryId: string, newParentId: string | null): boolean;
    getHierarchyTree(): any;
    exportStructure(): any;
    importStructure(data: any): boolean;
    getGlobalStats(): {
        totalRegistries: number;
        totalEntries: number;
        registryTypes: Record<string, number>;
        entryTypes: Record<string, number>;
    };
}
//# sourceMappingURL=hierarchical-registry.d.ts.map