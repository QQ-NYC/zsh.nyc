import { HyperPlugin, PluginContext, PluginLifecycleEvent } from "./types";
import { z } from "zod";

// Manifest schema for registry
export const manifest = {
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
    tags: ["demo","cli"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    license: "Apache-2.0",
    source_url: "https://github.com/Q-T0NLY/hyper-plugin-demo"
  },
  capabilities: ["command","ui"],
  permissions: ["read","write"],
  lifecycle_hooks: [PluginLifecycleEvent.INIT, PluginLifecycleEvent.ERROR]
};

// Plugin contract
export const plugin: HyperPlugin = {
  id: manifest.id,
  name: manifest.name,
  version: manifest.version,
  description: manifest.metadata.description,
  capabilities: new Set(manifest.capabilities),
  permissions: new Set(manifest.permissions),
  hooks: {
    [PluginLifecycleEvent.INIT]: async (ctx: PluginContext) => {
      ctx.logger.info(`[${plugin.name}] Initialized.`);
    },
    [PluginLifecycleEvent.ERROR]: async (ctx: PluginContext, err: Error) => {
      ctx.logger.error(`[${plugin.name}] Error: ${err.message}`);
    }
  },
  commands: new Map([
    ["hello", async (args, ctx) => ctx.logger.info("Hello World!")]
  ]),
  async initialize(ctx: PluginContext) {
    this.hooks[PluginLifecycleEvent.INIT]?.(ctx);
  },
  async shutdown() {
    // Clean up resources here
  },
  on(event, handler) { /* ... */ },
  emit(event, data) { /* ... */ }
};