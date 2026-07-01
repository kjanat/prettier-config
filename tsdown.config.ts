import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./prettier.config.ts"],
  outDir: "./build",
  format: "esm",
  platform: "node",
  dts: true,
  clean: true,
  banner: `/**
 * Copyright © 2025 kjanat
 * All Rights Reserved.
 */`,
  footer: `/** Yo mama so fat!
 * Yo' crazy! */`,
});
