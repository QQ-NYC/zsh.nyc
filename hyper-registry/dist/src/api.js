"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify = (0, fastify_1.default)();
fastify.get("/registry/plugins", async (_req, _res) => {
    // TODO: retrieve plugins from SQLite
    return [{ name: "example-plugin", version: "1.0.0" }];
});
fastify.get("/metrics", async (_req, _res) => {
    return { cpu: 42, memory: 73, gpu: 19 };
});
fastify.listen({ port: 3030 }, err => {
    if (err)
        throw err;
    console.log("API Gateway started on http://localhost:3030");
});
//# sourceMappingURL=api.js.map