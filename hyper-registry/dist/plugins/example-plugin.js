"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const types_1 = require("../src/types");
exports.plugin = {
    id: "a79e52ce-a9fd-4912-86ea-e9aad76c0001",
    name: "example-plugin",
    version: "1.0.0",
    description: "Demo Hyper Plugin",
    capabilities: new Set(["command", "ui"]),
    permissions: new Set(["read", "write"]),
    hooks: {
        [types_1.PluginLifecycleEvent.INIT]: async (ctx) => ctx.logger.info(`[${exports.plugin.name}] Initialized.`),
        [types_1.PluginLifecycleEvent.ERROR]: async (ctx, err) => ctx.logger.error(`[${exports.plugin.name}] Error: ${err.message}`)
    },
    commands: new Map([
        ["hello", async (_args, ctx) => ctx.logger.info("Hello World!")]
    ]),
    async initialize(ctx) { await this.hooks[types_1.PluginLifecycleEvent.INIT]?.(ctx); },
    async shutdown() { },
    on(_event, _handler) { },
    emit(_event, _data) { }
};
//# sourceMappingURL=example-plugin.js.map