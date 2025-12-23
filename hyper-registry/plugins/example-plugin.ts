import { HyperPlugin, PluginContext, PluginLifecycleEvent } from "../src/types";

export const plugin: HyperPlugin = {
  id: "a79e52ce-a9fd-4912-86ea-e9aad76c0001",
  name: "example-plugin",
  version: "1.0.0",
  description: "Demo Hyper Plugin",
  capabilities: new Set(["command","ui"]),
  permissions: new Set(["read","write"]),
  hooks: {
    [PluginLifecycleEvent.INIT]: async (ctx: PluginContext) => ctx.logger.info(`[${plugin.name}] Initialized.`),
    [PluginLifecycleEvent.ERROR]: async (ctx: PluginContext, err: Error) => ctx.logger.error(`[${plugin.name}] Error: ${err.message}`)
  },
  commands: new Map([
    ["hello", async (_args, ctx) => ctx.logger.info("Hello World!")]
  ]),
  async initialize(ctx: PluginContext) { await this.hooks[PluginLifecycleEvent.INIT]?.(ctx); },
  async shutdown() {},
  on(_event, _handler) {/* ... */},
  emit(_event, _data) {/* ... */}
};