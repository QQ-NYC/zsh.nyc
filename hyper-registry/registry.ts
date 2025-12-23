import { z } from "zod";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { v7 as uuidv7 } from "uuid";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// SCHEMA: Plugin / Service / Config / Template (Zod)
export const PluginManifestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().regex(/^[a-z0-9-]+$/),
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

// SQLITE DB
export const db = drizzle(new Database("registry.sqlite"));

// REGISTER FUNCTION
export async function registerPlugin(manifestPath: string): Promise<void> {
  const raw = readFileSync(manifestPath, "utf8");
  const manifest = PluginManifestSchema.parse(JSON.parse(raw));
  // Save to DB
  await db.insert("plugins").values(manifest);
  console.log(`🔗 Registered plugin: ${manifest.name} @ ${manifest.version}`);
}

// PLUGIN LOADER (auto-discovery, signature validation)
export async function loadPlugins(scanDir: string): Promise<PluginManifest[]> {
  const plugins: PluginManifest[] = [];
  for (const file of await fs.promises.readdir(scanDir)) {
    if (!file.endsWith(".plugin.json")) continue;
    try {
      const manifest = PluginManifestSchema.parse(
        JSON.parse(readFileSync(join(scanDir, file), "utf8"))
      );
      // TODO: signature/Ed25519 validation on manifest.signature!
      plugins.push(manifest);
    } catch (e) {
      console.error(`Invalid manifest ${file}:`, e);
    }
  }
  return plugins;
}

// RBAC/Namespace model example
export const NamespaceSchema = z.object({
  path: z.string(), // global/system/registry
  owner: z.string(),
  project: z.string(),
  type: z.string(),
  name: z.string(),
  version: z.string()
});
export type NamespaceEntry = z.infer<typeof NamespaceSchema>;

// SBOM (Software Bill Of Materials)
// - drizzle-orm@0.30.7
// - better-sqlite3@8.4.0
// - zod@3.22.4
// - uuid@9.0.1