import { defineConfig } from "tsdown";

export default defineConfig({
  format: "esm",
  target: "esnext",
  dts: true,
  minify: true,
  sourcemap: true,
  nodeProtocol: true,
  fixedExtension: false,
});
