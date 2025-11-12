#!/usr/bin/env bun
import { relative } from "node:path";
import { banner, footer } from "./.notice.yml" with { type: "yaml" };

const build = await Bun.build({
  entrypoints: ["./prettier.config.ts"],
  banner: banner,
  footer: footer,
  outdir: "./build",
  naming: "[name].js",
  target: "node",
  format: "esm",
  minify: { whitespace: true, identifiers: false, syntax: false },
});

if (!build.success) {
  console.error("Build failed:");
  for (const log of build.logs) {
    console.error(log);
  }
  process.exit(1);
}

const artifact = build.outputs[0];
if (!artifact) {
  console.error("No build artifacts generated");
  process.exit(1);
}

const relativePath = relative(process.cwd(), artifact.path);
console.log(`✓ Built: ${relativePath} (${artifact.size} bytes)`);
