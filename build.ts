#!/usr/bin/env bun
import { relative } from "node:path";
import { $ } from "bun";
import { banner, footer } from "./.notice.yml" with { type: "yaml" };

// Parse CLI flags
const buildCJS = process.argv.includes("--cjs");

// Build ESM (always)
const esmBuild = await Bun.build({
  entrypoints: ["./prettier.config.ts"],
  banner: banner,
  footer: footer,
  outdir: "./build",
  naming: "[name].js",
  target: "node",
  format: "esm",
  minify: { whitespace: true, identifiers: false, syntax: false },
});

if (!esmBuild.success) {
  console.error("ESM build failed:");
  for (const log of esmBuild.logs) {
    console.error(log);
  }
  process.exit(1);
}

const esmArtifact = esmBuild.outputs[0];
if (!esmArtifact) {
  console.error("No ESM artifacts generated");
  process.exit(1);
}

console.log(
  `✓ Built ESM: ${relative(process.cwd(), esmArtifact.path)} (${esmArtifact.size} bytes)`,
);

// Build CJS (optional)
if (buildCJS) {
  const cjsBuild = await Bun.build({
    entrypoints: ["./prettier.config.ts"],
    banner: banner,
    footer: footer,
    outdir: "./build",
    naming: "[name].cjs",
    target: "node",
    format: "cjs",
    minify: { whitespace: true, identifiers: false, syntax: false },
  });

  if (!cjsBuild.success) {
    console.error("CJS build failed:");
    for (const log of cjsBuild.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  const cjsArtifact = cjsBuild.outputs[0];
  if (!cjsArtifact) {
    console.error("No CJS artifacts generated");
    process.exit(1);
  }

  console.log(
    `✓ Built CJS: ${relative(process.cwd(), cjsArtifact.path)} (${cjsArtifact.size} bytes)`,
  );
}

// Generate type declarations
await $`tsc prettier.config.ts --emitDeclarationOnly --declaration --outDir ./build --moduleResolution bundler --module esnext --target esnext --skipLibCheck`.quiet();
console.log("✓ Generated type declarations (.d.ts)");

// Generate CJS type declarations if building CJS
if (buildCJS) {
  const { readFileSync, writeFileSync } = await import("node:fs");
  const dtsContent = readFileSync("./build/prettier.config.d.ts", "utf-8");
  // Convert ESM export default to CJS export =
  const dctsContent = dtsContent.replace(/export default /g, "export = ");
  writeFileSync("./build/prettier.config.d.cts", dctsContent);
  console.log("✓ Generated CJS type declarations (.d.cts)");
}
