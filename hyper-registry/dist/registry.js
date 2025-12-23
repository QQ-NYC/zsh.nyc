"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceSchema = exports.db = exports.PluginManifestSchema = void 0;
exports.registerPlugin = registerPlugin;
exports.loadPlugins = loadPlugins;
const zod_1 = require("zod");
const better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
const better_sqlite3_2 = __importDefault(require("better-sqlite3"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
// SCHEMA: Plugin / Service / Config / Template (Zod)
exports.PluginManifestSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().regex(/^[a-z0-9-]+$/),
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
// SQLITE DB
exports.db = (0, better_sqlite3_1.drizzle)(new better_sqlite3_2.default("registry.sqlite"));
// REGISTER FUNCTION
async function registerPlugin(manifestPath) {
    const raw = (0, node_fs_1.readFileSync)(manifestPath, "utf8");
    const manifest = exports.PluginManifestSchema.parse(JSON.parse(raw));
    // Save to DB
    await exports.db.insert("plugins").values(manifest);
    console.log(`🔗 Registered plugin: ${manifest.name} @ ${manifest.version}`);
}
// PLUGIN LOADER (auto-discovery, signature validation)
async function loadPlugins(scanDir) {
    const plugins = [];
    for (const file of await fs.promises.readdir(scanDir)) {
        if (!file.endsWith(".plugin.json"))
            continue;
        try {
            const manifest = exports.PluginManifestSchema.parse(JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(scanDir, file), "utf8")));
            // TODO: signature/Ed25519 validation on manifest.signature!
            plugins.push(manifest);
        }
        catch (e) {
            console.error(`Invalid manifest ${file}:`, e);
        }
    }
    return plugins;
}
// RBAC/Namespace model example
exports.NamespaceSchema = zod_1.z.object({
    path: zod_1.z.string(), // global/system/registry
    owner: zod_1.z.string(),
    project: zod_1.z.string(),
    type: zod_1.z.string(),
    name: zod_1.z.string(),
    version: zod_1.z.string()
});
// SBOM (Software Bill Of Materials)
// - drizzle-orm@0.30.7
// - better-sqlite3@8.4.0
// - zod@3.22.4
// - uuid@9.0.1
//# sourceMappingURL=registry.js.map