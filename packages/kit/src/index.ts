import { Hono } from "hono";
import type { Context, Env } from "hono";
import path from "path";

export type HandlerContext = Context<Env, string, {}>;

const app = new Hono();

const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: path.join(process.cwd(), "app"),
  assetPrefix: "_public",
});

for (const route in router.routes) {
  app.get(route, async (context) => {
    const routeHandler = await import(router.routes[route]);
    return routeHandler?.GET(context);
  });
  app.post(route, async (context) => {
    const routeHandler = await import(router.routes[route]);
    return routeHandler?.POST(context);
  });
}

export { app };
