"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.manifest = void 0;
const types_1 = require("./types");
// Manifest schema for registry
exports.manifest = {
    id: "a79e52ce-a9fd-4912-86ea-e9aad76c0001",
    name: "example-plugin",
    version: "1.0.0",
    type: "cli",
    manifest: {},
    dependencies: {},
    registry_dependencies: {},
    signature: "",
    storage_hash: "",
    metadata: {
        author: "Q-T0NLY",
        description: "Demo Hyper Plugin",
        tags: ["demo", "cli"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        license: "Apache-2.0",
        source_url: "https://github.com/Q-T0NLY/hyper-plugin-demo"
    },
    capabilities: ["command", "ui"],
    permissions: ["read", "write"],
    lifecycle_hooks: [types_1.PluginLifecycleEvent.INIT, types_1.PluginLifecycleEvent.ERROR]
};
// Plugin contract
exports.plugin = {
    id: exports.manifest.id,
    name: exports.manifest.name,
    version: exports.manifest.version,
    description: exports.manifest.metadata.description,
    capabilities: new Set(exports.manifest.capabilities),
    permissions: new Set(exports.manifest.permissions),
    hooks: {
        [types_1.PluginLifecycleEvent.INIT]: async (ctx) => {
            ctx.logger.info(`[${exports.plugin.name}] Initialized.`);
        },
        [types_1.PluginLifecycleEvent.ERROR]: async (ctx, err) => {
            ctx.logger.error(`[${exports.plugin.name}] Error: ${err.message}`);
        }
    },
    commands: new Map([
        ["hello", async (args, ctx) => ctx.logger.info("Hello World!")]
    ]),
    async initialize(ctx) {
        this.hooks[types_1.PluginLifecycleEvent.INIT]?.(ctx);
    },
    async shutdown() {
        // Clean up resources here
    },
    on(event, handler) { },
    emit(event, data) { }
};
//# sourceMappingURL=example-plugin.js.map