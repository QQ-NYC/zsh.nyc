import Fastify from "fastify";
const fastify = Fastify();

fastify.get("/registry/plugins", async (_req, _res) => {
  // TODO: retrieve plugins from SQLite
  return [{ name: "example-plugin", version: "1.0.0" }];
});
fastify.get("/metrics", async (_req, _res) => {
  return { cpu: 42, memory: 73, gpu: 19 };
});
fastify.listen({ port: 3030 }, err => {
  if (err) throw err;
  console.log("API Gateway started on http://localhost:3030");
});