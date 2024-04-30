import { build } from "esbuild";

build({
  platform: "node",
  bundle: true,
  packages: "external",
  // format: ""
  minify: true,
  entryPoints: ["src/index.ts"],
  outExtension: { ".js": ".cjs" },
  outdir: "dist",
});
