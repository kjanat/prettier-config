#!/usr/bin/env bun
import { readdir } from "node:fs/promises";

const prettierconfig = "./prettier.config.ts";
const outDir = "./dist";

if (!(await Bun.file(prettierconfig).exists())) {
  console.error(`Error: Entry point '${prettierconfig}' does not exist.`);
  process.exit(1);
}

console.log("🚀 Starting build process...");

const commonOptions: Omit<Bun.BuildConfig, "format" | "naming"> = {
  entrypoints: [prettierconfig],
  outdir: outDir,
  target: "node",
  minify: false,
  sourcemap: "external",
};

const esmBuild = await Bun.build({
  ...commonOptions,
  format: "esm",
  naming: "[dir]/[name].[ext]",
});

// Optionally build CJS version too
const cjsBuild = await Bun.build({
  ...commonOptions,
  format: "cjs",
  naming: "[dir]/[name].cjs",
});

if (!esmBuild.success || !cjsBuild.success) {
  console.error("❌ Build failed!");
  process.exit(1);
}

console.log("📦 Generated:", esmBuild.outputs[0]?.path);
console.log("📦 Generated:", cjsBuild.outputs[0]?.path);

console.log("\n🔧 Generating type declarations...");
const typegenResult = await Bun.$`tsgo --project tsconfig.build.json`;
if (typegenResult.exitCode !== 0) {
  console.error("❌ Type generation failed!");
  process.exit(1);
}

// Copy .d.ts to .d.cts for CJS compatibility
const dtsPath = `${outDir}/prettier.config.d.ts`;
const dctsPath = `${outDir}/prettier.config.d.cts`;
await Bun.write(dctsPath, await Bun.file(dtsPath).text());
console.log("📦 Generated CJS types:", dctsPath);

const files = await readdir(outDir, { recursive: true });
console.log("\n📁 Output files:", files);

console.log("\n✅ Build complete!");
