import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

/**
 * @see [GitHub tailwindlabs/prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file)
 */
const tailwindOptions: PluginOptions = {
  tailwindFunctions: ["cn", "clsx", "tw"],
};

/**
 * @see [prettier.io/docs](https://prettier.io/docs/configuration)
 */
const config: Config = {
  plugins: [
    "@prettier/plugin-xml",
    "prettier-plugin-packagejson",
    // Load Tailwind CSS plugin last, always!
    "prettier-plugin-tailwindcss",
  ],
  ...tailwindOptions,
  objectWrap: "collapse",
  experimentalTernaries: true,
  overrides: [
    { files: ["*.css"], options: { useTabs: true } },
    {
      files: ["*.jsonc"],
      options: { parser: "json", trailingComma: "none", useTabs: true },
    },
    { files: ["*.yaml", "*.yml"], options: { singleQuote: false } },
    {
      files: ["*.xml", "*.svg"],
      options: {
        parser: "xml",
        useTabs: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
        xmlSortAttributesByKey: true,
      },
    },
    {
      files: ["*.html"],
      options: { useTabs: true, xmlWhitespaceSensitivity: "ignore" },
    },
  ],
};

export default config;
