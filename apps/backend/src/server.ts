import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 9090);
const host = process.env.HOST ?? "0.0.0.0";
const appBase = "/lucky-moment";

await app.register(cors, {
  origin: process.env.WEB_ORIGIN?.split(",") ?? true,
});

await app.register(fastifyStatic, {
  root: join(dirname(fileURLToPath(import.meta.url)), "../../web/dist"),
  prefix: `${appBase}/`,
});

app.get("/", async (_request, reply) => {
  return reply.redirect(`${appBase}/`);
});

app.get(appBase, async (_request, reply) => {
  return reply.sendFile("index.html");
});

app.addHook("onSend", async (request, reply, payload) => {
  const path = request.url.split("?", 1)[0];
  if (path === "/" || path === "/index.html") {
    reply.header("Cache-Control", "no-cache");
  } else if (path.includes("/assets/")) {
    reply.header("Cache-Control", "public, max-age=31536000, immutable");
  } else if (!path.startsWith("/api/")) {
    reply.header("Cache-Control", "public, max-age=86400");
  }
  return payload;
});

app.get("/api/health", async () => ({ status: "ok" }));

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
