# @kjanat/prettier-config

A comprehensive, shareable Prettier configuration with built-in support for XML, Tailwind CSS, and package.json formatting. All required plugins are included - no additional installation needed! Works seamlessly with Bun, Node.js, CommonJS, ES Modules, and TypeScript projects.

## Features

- ✨ **Zero Configuration**: All plugins included - just install and use!
- 🎯 **Universal Compatibility**: Works with ESM, CommonJS, and TypeScript
- 🚀 **Runtime Support**: Optimized for Bun, Node.js 18+, and modern bundlers
- 🎨 **Tailwind CSS**: Built-in support with custom function names
- 📦 **Package.json**: Automatic formatting and sorting
- 📄 **XML/SVG**: Comprehensive XML and SVG formatting
- 🔧 **TypeScript**: Full type definitions included
- 📊 **Multiple Output Formats**: ESM (`.mjs`), CommonJS (`.cjs`), and dual-mode
- 🗺️ **Source Maps**: Included for debugging

## Installation

### Using Bun (Recommended)

```sh
bun add -d @kjanat/prettier-config prettier
```

### Using npm

```sh
npm install --save-dev @kjanat/prettier-config prettier
```

### Using yarn

```sh
yarn add --dev @kjanat/prettier-config prettier
```

### Using pnpm

```sh
pnpm add -D @kjanat/prettier-config prettier
```

## Usage

### Basic Usage

Add to your `package.json`:

```json
{ "prettier": { "plugins": ["@kjanat/prettier-config"] } }
```

Or create a `.prettierrc` file:

```json
{ "plugins": ["@kjanat/prettier-config"] }
```

### Extending the Configuration

#### ES Modules (.prettierrc.mjs or prettier.config.mjs)

```js
import prettierConfig from "@kjanat/prettier-config";

/**
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig,
  // Your overrides here
  semi: false,
  printWidth: 100,
};

export default config;
```

#### CommonJS (.prettierrc.cjs or prettier.config.cjs)

```js
const prettierConfig = require("@kjanat/prettier-config");

/**
 * @type {import("prettier").Config}
 */
module.exports = {
  ...prettierConfig,
  // Your overrides here
  semi: false,
  printWidth: 100,
};
```

#### TypeScript (.prettierrc.ts or prettier.config.ts)

```ts
import type { Config } from "prettier";
import prettierConfig from "@kjanat/prettier-config";

const config: Config = {
  ...prettierConfig,
  // Your overrides here with full type safety
  semi: false,
  printWidth: 100,
} satisfies Config;

export default config;
```

#### JSON with Comments (.prettierrc.json or .prettierrc)

```jsonc
{
  // Extend the base configuration
  "prettier": "@kjanat/prettier-config",
  // Add your overrides
  "semi": false,
  "printWidth": 100
}
```

## Configuration Details

### Included Plugins

This configuration includes and bundles the following Prettier plugins (no separate installation required):

- [**@prettier/plugin-xml**](https://github.com/prettier/plugin-xml): XML and SVG formatting
- [**prettier-plugin-packagejson**](https://github.com/matzkoh/prettier-plugin-packagejson): Sorts and formats package.json files
- [**prettier-plugin-sh**](https://github.com/un-ts/prettier/tree/master/packages/sh): Shell script formatting
- [**prettier-plugin-tailwindcss**][plugin-tailwindcss]: Sorts Tailwind CSS classes

[plugin-tailwindcss]: https://github.com/tailwindlabs/prettier-plugin-tailwindcss

### Default Settings

```js
module.exports = {
  // Tailwind CSS functions
  tailwindFunctions: ["cn", "clsx", "tw"],

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

    // XML and SVG files
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

    // HTML files
    {
      files: ["*.html"],
      options: { useTabs: true, xmlWhitespaceSensitivity: "ignore" },
    },
  ],
};
```

### Tailwind CSS Configuration

The configuration includes support for common Tailwind CSS utility functions:

- `cn()` - Common className utility
- `clsx()` - Conditional classes
- `tw()` - Tagged template literals

To add more functions, extend the configuration:

```js
import prettierConfig from "@kjanat/prettier-config";

export default {
  ...prettierConfig,
  tailwindFunctions: [...prettierConfig.tailwindFunctions, "myCustomFunction"],
};
```

## Module Support

### ES Modules (Recommended for modern projects)

```js
// Native ESM import
import prettierConfig from "@kjanat/prettier-config";

// Dynamic import
const prettierConfig = await import("@kjanat/prettier-config");
```

### CommonJS (Legacy Node.js projects)

```js
// CommonJS require
const prettierConfig = require("@kjanat/prettier-config");
```

### TypeScript

```ts
// Full type safety with TypeScript
import type { Config } from "prettier";
import prettierConfig from "@kjanat/prettier-config";

// Config is fully typed
const myConfig: Config = prettierConfig;
```

### Bundler Support

Works out of the box with:

- ✅ Vite
- ✅ Webpack
- ✅ Rollup
- ✅ esbuild
- ✅ Parcel
- ✅ Turbopack
- ✅ Bun bundler

## Compatibility Matrix

| Environment | Version | Support                 |
| ----------- | ------- | ----------------------- |
| Bun         | ≥1.0.0  | ✅ Full                 |
| Node.js     | ≥18.0.0 | ✅ Full                 |
| Node.js     | 16.x    | ⚠️ Works but not tested |
| Deno        | Latest  | ✅ Via npm: specifier   |
| Browser     | Modern  | ✅ Via bundler          |

| Module System | File Extension        | Support            |
| ------------- | --------------------- | ------------------ |
| ES Modules    | `.mjs`, `.js`         | ✅ Full            |
| CommonJS      | `.cjs`, `.js`         | ✅ Full            |
| TypeScript    | `.ts`, `.mts`, `.cts` | ✅ Full with types |

## Scripts

```sh
# Build the package
bun run build

# Run type checking
bun run lint

# Format code
bun run format

# Check formatting
bun run format:check

# Clean build artifacts
bun run clean

# Run tests
bun test

# Check package exports
bun run test:exports

# Full build with validation
bun run build:check
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
3. **TypeScript**: Make sure `moduleResolution` is set to `"bundler"` or `"node16"` in tsconfig.json

### Plugin Not Working

All required plugins are included with this package. You only need to install Prettier itself:

```sh
bun add -d prettier
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
├── dist/                 # Built output
│   ├── prettier.config.js      # ESM output
│   ├── prettier.config.cjs     # CommonJS output
│   ├── prettier.config.d.ts    # TypeScript definitions (ESM)
│   ├── prettier.config.d.cts   # TypeScript definitions (CommonJS)
│   └── prettier.config.*.map   # Source maps
├── build.ts              # Build configuration
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config
└── tsconfig.build.json   # Build-specific TypeScript config
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
