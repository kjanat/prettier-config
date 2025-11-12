# @kjanat/prettier-config

Shareable Prettier configuration with plugin support.

## Features

- 🎯 Consistent formatting across projects
- 🚀 Bun and Node.js 18+ support
- 🎨 Tailwind CSS class sorting
- 📦 Optional plugins for XML, SVG, package.json, shell scripts, and more
- 🔧 Full TypeScript definitions

## Installation

### Basic

```sh
# Bun
bun add -d @kjanat/prettier-config prettier

# npm
npm install --save-dev @kjanat/prettier-config prettier
```

### Optional Plugins

Install as needed:

```sh
bun add -d \
  @prettier/plugin-xml \
  prettier-plugin-go-template \
  prettier-plugin-nginx \
  prettier-plugin-pkg \
  prettier-plugin-prisma \
  prettier-plugin-sh \
  prettier-plugin-tailwindcss \
  prettier-plugin-toml
```

## Usage

### Basic

Add to `package.json`:

```json
{ "prettier": "@kjanat/prettier-config" }
```

Or create `.prettierrc`:

```text
"@kjanat/prettier-config"
```

### Extending

Create `prettier.config.mjs`:

```js
import prettierConfig from "@kjanat/prettier-config";

export default { ...prettierConfig, semi: false, printWidth: 100 };
```

Or with TypeScript (`prettier.config.ts`):

```ts
import type { Config } from "prettier";
import prettierConfig from "@kjanat/prettier-config";

export default { ...prettierConfig, semi: false } satisfies Config;
```

## Configuration

### Supported Plugins

- **@prettier/plugin-xml**: XML and SVG formatting
- **prettier-plugin-go-template**: Go templates
- **prettier-plugin-nginx**: Nginx configs
- **prettier-plugin-pkg**: Sorts package.json
- **prettier-plugin-prisma**: Prisma schemas
- **prettier-plugin-sh**: Shell scripts
- **prettier-plugin-tailwindcss**: Sorts Tailwind classes
- **prettier-plugin-toml**: TOML files

### Key Settings

```js
{
  objectWrap: "collapse",
  experimentalTernaries: true,
  overrides: [
    // CSS, HTML, XML use tabs
    { files: ["*.css"], options: { useTabs: true } },
    { files: ["*.html"], options: { useTabs: true } },

    // SVG uses HTML parser for better whitespace handling
    {
      files: ["*.svg"],
      options: { parser: "html", htmlWhitespaceSensitivity: "ignore", useTabs: true }
    },

    // Markdown wraps at printWidth
    { files: ["*.md"], options: { proseWrap: "always" } },

    // XML formatting
    {
      files: ["*.xml"],
      options: {
        parser: "xml",
        useTabs: true,
        singleAttributePerLine: true,
        xmlSortAttributesByKey: true
      }
    }
  ]
}
```

**Notable:**

- **SVG files**: Use HTML parser instead of XML for better inline SVG handling
- **Markdown**: Prose wraps at `printWidth` (override with
  `proseWrap: "preserve"` if needed)

### Tailwind CSS

Configure custom utility functions:

```js
import prettierConfig from "@kjanat/prettier-config";

export default { ...prettierConfig, tailwindFunctions: ["cn", "clsx", "tw"] };
```

## Compatibility

| Environment | Version | Support |
| ----------- | ------- | ------- |
| Bun         | ≥1.0.0  | ✅      |
| Node.js     | ≥18.0.0 | ✅      |

**Module System**: ESM only

## Scripts

```sh
bun run build  # Build package
bun typecheck  # Type checking
bun run format # Format code
```

## Troubleshooting

### Plugin Not Working

Plugins are peer dependencies. Install required plugins:

```sh
bun add -d @prettier/plugin-xml prettier-plugin-tailwindcss
```

### Module Resolution

- **ESM**: Add `"type": "module"` to `package.json`
- **CommonJS**: Use `.cjs` extension for config
- **TypeScript**: Set `moduleResolution` to `"bundler"` or `"node16"`

## Contributing

Contributions welcome! Submit a PR:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and open PR

## License

MIT © kjanat
