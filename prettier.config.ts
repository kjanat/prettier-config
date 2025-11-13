import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

/**
 * @satisfies {PluginOptions}
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss
 */
const tailwindOptions = {} satisfies PluginOptions;

/**
 * Prettier configuration with multi-language support.
 *
 * Includes plugins for `XML`, `package.json`, `shell scripts`, `Go templates`,
 * `Nginx` configs, `Prisma` schemas, `TOML` files, and `Tailwind CSS`.
 *
 * @satisfies { Config }
 * @see https://prettier.io/docs/configuration
 */
const config = {
  /**
   * Prettier plugins for extended language support.
   *
   * @important Tailwind CSS plugin MUST be loaded last to ensure proper class sorting
   */
  plugins: [
    "@prettier/plugin-xml",
    "prettier-plugin-go-template",
    "prettier-plugin-nginx",
    "prettier-plugin-pkg",
    "prettier-plugin-prisma",
    "prettier-plugin-sh",
    "prettier-plugin-toml",
    // Load Tailwind CSS plugin last, always!
    "prettier-plugin-tailwindcss",
  ],
  printWidth: 120,
  /** Collapse object literals when they fit on a single line */
  objectWrap: "preserve",
  /** Enable experimental ternary expression formatting */
  experimentalTernaries: true,
  /**
   * File-type specific formatting overrides.
   */
  overrides: [
    /** CSS files: Use tabs for indentation */
    { files: ["*.css"], options: { useTabs: true } },
    /** JSONC files: Use JSON parser, no trailing commas, tabs for indentation */
    {
      files: ["*.jsonc"],
      options: { parser: "json", trailingComma: "none", useTabs: true },
    },
    /** YAML files: Prefer double quotes over single quotes */
    { files: ["*.yaml", "*.yml"], options: { singleQuote: false } },
    /** HTML files: Use tabs for indentation */
    { files: ["*.html"], options: { useTabs: true } },
    /**
     * XML files: Use tabs, one attribute per line, sort attributes alphabetically
     */
    {
      files: ["*.xml"],
      options: {
        parser: "xml",
        useTabs: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
        xmlSortAttributesByKey: true,
      },
    },
    /**
     * SVG files: Use HTML parser, ignore whitespace sensitivity, use tabs
     */
    {
      files: ["*.svg"],
      options: {
        parser: "html",
        htmlWhitespaceSensitivity: "ignore",
        useTabs: true,
      },
    },
    /** Markdown files: Always wrap prose to fit line length */
    { files: ["*.md"], options: { proseWrap: "always" } },
  ],
  ...tailwindOptions,
} satisfies Config;

export default config;
