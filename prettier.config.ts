import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

/**
 * @see [GitHub tailwindlabs/prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file)
 */
// const tailwindOptions: PluginOptions = {
//   tailwindFunctions: ["cn", "clsx", "tw"],
// };

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
  // ...tailwindOptions,
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
      files: "*.svg",
      options: { parser: "html", htmlWhitespaceSensitivity: "ignore" },
    },
    { files: "*.md", options: { proseWrap: "always" } },
  ],
};

export default config;
