import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "esnext",
  dts: true,
  minify: true,
  sourcemap: true,
  nodeProtocol: true,
  fixedExtension: false,
});
