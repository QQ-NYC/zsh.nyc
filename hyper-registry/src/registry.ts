import { z } from "zod";

// Simplified in-memory registry for demonstration
// In production, would use proper database

// Zod plugin manifest schema (strict, matches your specs)
export const PluginManifestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().regex(/^[a-z0-9-]+$/), // kebab-case
  version: z.string(), // semver
  type: z.enum(["storage","transform","ui","mesh","cli","security","analytics"]),
  manifest: z.record(z.any()),
  dependencies: z.record(z.string()), // PluginID: VersionConstraint
  registry_dependencies: z.record(z.string()),
  signature: z.string(),
  storage_hash: z.string(),
  metadata: z.object({
    author: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    created_at: z.string(),
    updated_at: z.string(),
    license: z.string(),
    source_url: z.string().url()
  }),
  capabilities: z.array(z.string()),
  permissions: z.array(z.string()),
  lifecycle_hooks: z.array(z.string()),
  runtime_requirements: z.object({
    cpu_arch: z.string(),
    memory: z.number(),
    storage: z.number(),
    os: z.string(),
    runtime: z.string()
  }),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

// In-memory storage for demonstration
const registryStore: Map<string, PluginManifest> = new Map();

// Register plugin function
export async function registerPlugin(manifestPath: string): Promise<void> {
  const fs = require("fs");
  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = PluginManifestSchema.parse(JSON.parse(raw));
  registryStore.set(manifest.id, manifest);
  console.log(`🔗 Plugin registered: ${manifest.name} @ ${manifest.version}`);
}

// Auto-discover plugins in directory (manifest strict validation)
export async function loadPlugins(scanDir: string): Promise<PluginManifest[]> {
  const plugins: PluginManifest[] = [];
  const fs = require("fs");
  const path = require("path");

  try {
    const files = fs.readdirSync(scanDir);
    for (const file of files) {
      if (!file.endsWith(".plugin.json")) continue;
      try {
        const manifest = PluginManifestSchema.parse(JSON.parse(fs.readFileSync(path.join(scanDir, file), "utf8")));
        plugins.push(manifest);
        registryStore.set(manifest.id, manifest);
      } catch (e) {
        console.error(`❌ Manifest invalid: ${file}`, e);
      }
    }
  } catch (e) {
    console.error(`❌ Error scanning directory: ${scanDir}`, e);
  }
  return plugins;
}

// Get all plugins
export function getAllPlugins(): PluginManifest[] {
  return Array.from(registryStore.values());
}

// Get plugin by ID
export function getPlugin(id: string): PluginManifest | undefined {
  return registryStore.get(id);
}

// RBAC/Namespace example
export const NamespaceSchema = z.object({
  path: z.string(),
  owner: z.string(),
  project: z.string(),
  type: z.string(),
  name: z.string(),
  version: z.string()
});
export type NamespaceEntry = z.infer<typeof NamespaceSchema>;

// SBOM
// - zod@3.22.4