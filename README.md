# @kjanat/prettier-config

Yet another Prettier config.

## Features

- 🎯 **Shareable Configuration**: Consistent formatting across projects
- 🚀 **Runtime Support**: Works with Bun and Node.js 18+
- 🎨 **Tailwind CSS**: Support for common utility functions
- 📦 **Package.json**: Formatting with optional plugin
- 📄 **XML/SVG**: Optional XML and SVG formatting
- 🔧 **TypeScript**: Full type definitions included

## Installation

### Basic Installation

```sh
# Bun
bun add -d @kjanat/prettier-config prettier

# npm
npm install --save-dev @kjanat/prettier-config prettier

# yarn
yarn add --dev @kjanat/prettier-config prettier

# pnpm
pnpm add -D @kjanat/prettier-config prettier
```

### Optional Plugins

Install plugins as needed for your project:

```sh
bun add -d \
  @prettier/plugin-xml \
  prettier-plugin-go-template \
  prettier-plugin-nginx \
  prettier-plugin-packagejson \
  prettier-plugin-prisma \
  prettier-plugin-sh \
  prettier-plugin-tailwindcss \
  prettier-plugin-toml
```

## Usage

### Basic Usage

Add to your `package.json`:

```json
{ "prettier": "@kjanat/prettier-config" }
```

Or create a `.prettierrc` file:

```json
"@kjanat/prettier-config"
```

### Extending the Configuration

Create `prettier.config.mjs`:

```js
import prettierConfig from "@kjanat/prettier-config";

export default { ...prettierConfig, semi: false, printWidth: 100 };
```

Or with TypeScript (`prettier.config.ts`):

```ts
import type { Config } from "prettier";
import prettierConfig from "@kjanat/prettier-config";

export default {
  ...prettierConfig,
  semi: false,
  printWidth: 100,
} satisfies Config;
```

## Configuration Details

### Supported Plugins

This configuration supports the following Prettier plugins (install as needed):

- **@prettier/plugin-xml**: XML and SVG formatting
- **prettier-plugin-go-template**: Go template formatting
- **prettier-plugin-nginx**: Nginx config formatting
- **prettier-plugin-packagejson**: Sorts and formats package.json
- **prettier-plugin-prisma**: Prisma schema formatting
- **prettier-plugin-sh**: Shell script formatting
- **prettier-plugin-tailwindcss**: Sorts Tailwind CSS classes
- **prettier-plugin-toml**: TOML formatting

### Default Settings

```js
export default {
  // Object formatting
  objectWrap: "collapse",

  // Experimental features
  experimentalTernaries: true,

  // File-specific overrides
  overrides: [
    // CSS files use tabs
    { files: ["*.css"], options: { useTabs: true } },

    // JSON with comments
    {
      files: ["*.jsonc"],
      options: { parser: "json", trailingComma: "none", useTabs: true },
    },

    // YAML files
    { files: ["*.yaml", "*.yml"], options: { singleQuote: false } },

    // HTML files
    { files: ["*.html"], options: { useTabs: true } },

    // XML files
    {
      files: "*.xml",
      options: {
        parser: "xml",
        useTabs: true,
        bracketSameLine: false,
        singleAttributePerLine: true,
        xmlSortAttributesByKey: true,
      },
    },

    // SVG files (HTML parser for better whitespace handling)
    {
      files: "*.svg",
      options: {
        parser: "html",
        htmlWhitespaceSensitivity: "ignore",
        useTabs: true,
      },
    },

    // Markdown files
    { files: "*.md", options: { proseWrap: "always" } },
  ],
};
```

### Tailwind CSS Configuration

The `prettier-plugin-tailwindcss` plugin is included but requires user
configuration. To enable Tailwind CSS class sorting with custom utility
functions:

```js
import prettierConfig from "@kjanat/prettier-config";

export default {
  ...prettierConfig,
  // Configure your Tailwind utility functions (Optional)
  tailwindFunctions: ["cn", "clsx", "tw"],
};
```

## Module Support

This package exports ESM only:

```js
import prettierConfig from "@kjanat/prettier-config";
```

For TypeScript projects:

```ts
import prettierConfig from "@kjanat/prettier-config";
import type { Config } from "prettier";

const myConfig: Config = prettierConfig;
```

## Compatibility

| Environment | Version | Support |
| ----------- | ------- | ------- |
| Bun         | ≥1.0.0  | ✅      |
| Node.js     | ≥18.0.0 | ✅      |

**Module System**: ESM only (`.mjs`, `.js`, `.ts`)

## Scripts

```sh
# Build the package
bun run build

# Run type checking
bun typecheck

# Format code
bun run format
```

## Migration Guide

### From Custom Configuration

1. Install the package:

   ```sh
   bun add -d @kjanat/prettier-config
   ```

2. Replace your `.prettierrc` content:

   ```diff
   - {
   -   "semi": true,
   -   "singleQuote": false,
   -   // ... other options
   - }
   + "@kjanat/prettier-config"
   ```

3. If you need to keep some custom settings, extend instead:

   ```js
   // .prettierrc.mjs
   import prettierConfig from "@kjanat/prettier-config";

   export default {
     ...prettierConfig,
     // Keep your custom settings
     semi: false,
   };
   ```

### From prettier-config-\* packages

Most shareable configs follow the same pattern. Simply:

1. Uninstall the old config
2. Install this one
3. Update the reference in your configuration

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues:

1. **ESM Projects**: Ensure your `package.json` has `"type": "module"`
2. **CommonJS Projects**: Use the `.cjs` extension for your config file
3. **TypeScript**: Make sure `moduleResolution` is set to `"bundler"` or
   `"node16"` in tsconfig.json

### Plugin Not Working

Plugins are peer dependencies and must be installed separately. Install the
plugins you need:

```sh
bun add -d @prettier/plugin-xml prettier-plugin-tailwindcss
```

If you still experience issues, try clearing your node_modules and reinstalling:

```sh
rm -rf node_modules bun.lock* package-lock.json yarn.lock pnpm-lock.yaml
bun install
```

### Type Definitions Not Found

For TypeScript projects, ensure you have:

```sh
bun add -d typescript @types/node
```

## Development

### Building from Source

```sh
# Clone the repository
git clone https://github.com/kjanat/prettier-config.git
cd prettier-config

# Install dependencies
bun install

# Build the package
bun run build

# Run tests
bun test
```

### Project Structure

```text
prettier-config/
├── prettier.config.ts    # Source configuration
├── build/                # Built output
│   └── prettier.config.js     # ESM output
├── build.ts              # Build script
├── package.json          # Package manifest
└── tsconfig.json         # TypeScript config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © kjanat
