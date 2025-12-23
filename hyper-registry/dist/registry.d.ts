import { z } from "zod";
export declare const PluginManifestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    type: z.ZodEnum<["storage", "transform", "ui", "mesh", "cli", "security", "analytics"]>;
    manifest: z.ZodRecord<z.ZodString, z.ZodAny>;
    dependencies: z.ZodRecord<z.ZodString, z.ZodString>;
    registry_dependencies: z.ZodRecord<z.ZodString, z.ZodString>;
    signature: z.ZodString;
    storage_hash: z.ZodString;
    metadata: z.ZodObject<{
        author: z.ZodString;
        description: z.ZodString;
        tags: z.ZodArray<z.ZodString, "many">;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        license: z.ZodString;
        source_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tags: string[];
        author: string;
        description: string;
        created_at: string;
        updated_at: string;
        license: string;
        source_url: string;
    }, {
        tags: string[];
        author: string;
        description: string;
        created_at: string;
        updated_at: string;
        license: string;
        source_url: string;
    }>;
    capabilities: z.ZodArray<z.ZodString, "many">;
    permissions: z.ZodArray<z.ZodString, "many">;
    lifecycle_hooks: z.ZodArray<z.ZodString, "many">;
    runtime_requirements: z.ZodObject<{
        cpu_arch: z.ZodString;
        memory: z.ZodNumber;
        storage: z.ZodNumber;
        os: z.ZodString;
        runtime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        storage: number;
        cpu_arch: string;
        memory: number;
        os: string;
        runtime: string;
    }, {
        storage: number;
        cpu_arch: string;
        memory: number;
        os: string;
        runtime: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    metadata: {
        tags: string[];
        author: string;
        description: string;
        created_at: string;
        updated_at: string;
        license: string;
        source_url: string;
    };
    type: "cli" | "ui" | "security" | "storage" | "transform" | "mesh" | "analytics";
    name: string;
    version: string;
    manifest: Record<string, any>;
    dependencies: Record<string, string>;
    registry_dependencies: Record<string, string>;
    signature: string;
    storage_hash: string;
    capabilities: string[];
    permissions: string[];
    lifecycle_hooks: string[];
    runtime_requirements: {
        storage: number;
        cpu_arch: string;
        memory: number;
        os: string;
        runtime: string;
    };
}, {
    id: string;
    metadata: {
        tags: string[];
        author: string;
        description: string;
        created_at: string;
        updated_at: string;
        license: string;
        source_url: string;
    };
    type: "cli" | "ui" | "security" | "storage" | "transform" | "mesh" | "analytics";
    name: string;
    version: string;
    manifest: Record<string, any>;
    dependencies: Record<string, string>;
    registry_dependencies: Record<string, string>;
    signature: string;
    storage_hash: string;
    capabilities: string[];
    permissions: string[];
    lifecycle_hooks: string[];
    runtime_requirements: {
        storage: number;
        cpu_arch: string;
        memory: number;
        os: string;
        runtime: string;
    };
}>;
export type PluginManifest = z.infer<typeof PluginManifestSchema>;
export declare const db: any;
export declare function registerPlugin(manifestPath: string): Promise<void>;
export declare function loadPlugins(scanDir: string): Promise<PluginManifest[]>;
export declare const NamespaceSchema: z.ZodObject<{
    path: z.ZodString;
    owner: z.ZodString;
    project: z.ZodString;
    type: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    type: string;
    name: string;
    version: string;
    owner: string;
    project: string;
}, {
    path: string;
    type: string;
    name: string;
    version: string;
    owner: string;
    project: string;
}>;
export type NamespaceEntry = z.infer<typeof NamespaceSchema>;
//# sourceMappingURL=registry.d.ts.map