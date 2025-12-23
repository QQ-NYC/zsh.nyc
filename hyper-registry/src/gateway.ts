import Fastify from "fastify";
import { z } from "zod";
const app = Fastify();

const artifactSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["plugin", "service", "config"]),
  name: z.string(),
  version: z.string(),
});
app.get("/artifacts/:id", async (req, reply) => {
  try {
    // Validate ID and return
    artifactSchema.parse({ id: req.params.id, type: "plugin", name: "sample", version: "1.0.0" });
    // TODO: Retrieve artifact from DB
    reply.send({ status: "ok" });
  } catch (e) {
    reply.status(400).send({ error: "Validation failed" });
  }
});
// RBAC middleware skeleton
app.addHook("preHandler", async (req, _res) => {
  // TODO: AuthZ/RBAC
});
app.listen({ port: 4040 });