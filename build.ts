import { build } from "esbuild"

build({
  platform: "node",
  bundle: true,
  packages: "external",
  minify: true,
  entryPoints: ["src/index.ts"],
  outdir:"dist"
})