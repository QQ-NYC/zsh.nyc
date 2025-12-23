"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceSchema = exports.PluginManifestSchema = void 0;
exports.registerPlugin = registerPlugin;
exports.loadPlugins = loadPlugins;
exports.getAllPlugins = getAllPlugins;
exports.getPlugin = getPlugin;
const zod_1 = require("zod");
// Simplified in-memory registry for demonstration
// In production, would use proper database
// Zod plugin manifest schema (strict, matches your specs)
exports.PluginManifestSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().regex(/^[a-z0-9-]+$/), // kebab-case
    version: zod_1.z.string(), // semver
    type: zod_1.z.enum(["storage", "transform", "ui", "mesh", "cli", "security", "analytics"]),
    manifest: zod_1.z.record(zod_1.z.any()),
    dependencies: zod_1.z.record(zod_1.z.string()), // PluginID: VersionConstraint
    registry_dependencies: zod_1.z.record(zod_1.z.string()),
    signature: zod_1.z.string(),
    storage_hash: zod_1.z.string(),
    metadata: zod_1.z.object({
        author: zod_1.z.string(),
        description: zod_1.z.string(),
        tags: zod_1.z.array(zod_1.z.string()),
        created_at: zod_1.z.string(),
        updated_at: zod_1.z.string(),
        license: zod_1.z.string(),
        source_url: zod_1.z.string().url()
    }),
    capabilities: zod_1.z.array(zod_1.z.string()),
    permissions: zod_1.z.array(zod_1.z.string()),
    lifecycle_hooks: zod_1.z.array(zod_1.z.string()),
    runtime_requirements: zod_1.z.object({
        cpu_arch: zod_1.z.string(),
        memory: zod_1.z.number(),
        storage: zod_1.z.number(),
        os: zod_1.z.string(),
        runtime: zod_1.z.string()
    }),
});
// In-memory storage for demonstration
const registryStore = new Map();
// Register plugin function
async function registerPlugin(manifestPath) {
    const fs = require("fs");
    const raw = fs.readFileSync(manifestPath, "utf8");
    const manifest = exports.PluginManifestSchema.parse(JSON.parse(raw));
    registryStore.set(manifest.id, manifest);
    console.log(`🔗 Plugin registered: ${manifest.name} @ ${manifest.version}`);
}
// Auto-discover plugins in directory (manifest strict validation)
async function loadPlugins(scanDir) {
    const plugins = [];
    const fs = require("fs");
    const path = require("path");
    try {
        const files = fs.readdirSync(scanDir);
        for (const file of files) {
            if (!file.endsWith(".plugin.json"))
                continue;
            try {
                const manifest = exports.PluginManifestSchema.parse(JSON.parse(fs.readFileSync(path.join(scanDir, file), "utf8")));
                plugins.push(manifest);
                registryStore.set(manifest.id, manifest);
            }
            catch (e) {
                console.error(`❌ Manifest invalid: ${file}`, e);
            }
        }
    }
    catch (e) {
        console.error(`❌ Error scanning directory: ${scanDir}`, e);
    }
    return plugins;
}
// Get all plugins
function getAllPlugins() {
    return Array.from(registryStore.values());
}
// Get plugin by ID
function getPlugin(id) {
    return registryStore.get(id);
}
// RBAC/Namespace example
exports.NamespaceSchema = zod_1.z.object({
    path: zod_1.z.string(),
    owner: zod_1.z.string(),
    project: zod_1.z.string(),
    type: zod_1.z.string(),
    name: zod_1.z.string(),
    version: zod_1.z.string()
});
// SBOM
// - zod@3.22.4
//# sourceMappingURL=registry.js.map