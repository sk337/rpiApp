import { build } from "esbuild";

build({
  platform: "node",
  bundle: true,
  packages: "external",
  minify: true,
  entryPoints: ["src/index.ts"],
  outExtension: { ".js": ".cjs" },
  outdir: "dist",
  target: "node16",
});
