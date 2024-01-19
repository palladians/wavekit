import { defineConfig } from "tsup";

export default defineConfig({
  entry: [".wavekit/index.ts", "app/**/*"],
  splitting: true,
  outDir: "build",
  clean: true,
});
