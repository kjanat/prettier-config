import type { Config } from "prettier";

/**
 * @see [prettier.io/docs](https://prettier.io/docs/configuration)
 */
const config: Config = {
  plugins: [
    "@prettier/plugin-xml",
    "prettier-plugin-packagejson",
    "prettier-plugin-sh",
    "prettier-plugin-go-template",
    "prettier-plugin-nginx",
    "prettier-plugin-prisma",
    "prettier-plugin-toml",
    // Load Tailwind CSS plugin last, always!
    "prettier-plugin-tailwindcss",
  ],
  objectWrap: "collapse",
  experimentalTernaries: true,
  overrides: [
    { files: ["*.css"], options: { useTabs: true } },
    {
      files: ["*.jsonc"],
      options: { parser: "json", trailingComma: "none", useTabs: true },
    },
    { files: ["*.yaml", "*.yml"], options: { singleQuote: false } },
    { files: ["*.html"], options: { useTabs: true } },
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
    {
      files: ["*.svg"],
      options: {
        parser: "html",
        htmlWhitespaceSensitivity: "ignore",
        useTabs: true,
      },
    },
    { files: ["*.md"], options: { proseWrap: "always" } },
  ],
};

export default config;
