import { Hono } from "hono";
import type { Context, Env } from "hono";
import path from "path";

export type HandlerContext = Context<Env, string, {}>;

const app = new Hono();

const routesDir =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "build", "app")
    : path.join(process.cwd(), "app");

const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: routesDir,
  assetPrefix: "_public",
});

for (const route in router.routes) {
  app.all(route, async (context) => {
    const routeHandler = await import(router.routes[route]);
    return routeHandler?.[context.req.method.toUpperCase()](context);
  });
}

export { app };
