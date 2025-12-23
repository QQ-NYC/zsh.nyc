"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const app = (0, fastify_1.default)();
const artifactSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    type: zod_1.z.enum(["plugin", "service", "config"]),
    name: zod_1.z.string(),
    version: zod_1.z.string(),
});
app.get("/artifacts/:id", async (req, reply) => {
    try {
        // Validate ID and return
        artifactSchema.parse({ id: req.params.id, type: "plugin", name: "sample", version: "1.0.0" });
        // TODO: Retrieve artifact from DB
        reply.send({ status: "ok" });
    }
    catch (e) {
        reply.status(400).send({ error: "Validation failed" });
    }
});
// RBAC middleware skeleton
app.addHook("preHandler", async (req, _res) => {
    // TODO: AuthZ/RBAC
});
app.listen({ port: 4040 });
//# sourceMappingURL=gateway.js.map