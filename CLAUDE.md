Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## bun pm

### version

To display current package version and help:

```bash terminal icon="terminal" theme={"theme":{"light":"github-light","dark":"dracula"}}
bun pm version
```

```txt theme={"theme":{"light":"github-light","dark":"dracula"}}
bun pm version v1.3.0 (ca7428e9)
Current package version: v1.0.0

Increment:
  patch      1.0.0 → 1.0.1
  minor      1.0.0 → 1.1.0
  major      1.0.0 → 2.0.0
  prerelease 1.0.0 → 1.0.1-0
  prepatch   1.0.0 → 1.0.1-0
  preminor   1.0.0 → 1.1.0-0
  premajor   1.0.0 → 2.0.0-0
  from-git   Use version from latest git tag
  1.2.3      Set specific version

Options:
  --no-git-tag-version Skip git operations
  --allow-same-version Prevents throwing error if version is the same
  --message=<val>, -m  Custom commit message, use %s for version substitution
  --preid=<val>        Prerelease identifier (i.e beta → 1.0.1-beta.0)
  --force, -f          Bypass dirty git history check

Examples:
  bun pm version patch
  bun pm version 1.2.3 --no-git-tag-version
  bun pm version prerelease --preid beta --message "Release beta: %s"
```

To bump the version in `package.json`:

```bash terminal icon="terminal" theme={"theme":{"light":"github-light","dark":"dracula"}}
bun pm version patch
```

```txt theme={"theme":{"light":"github-light","dark":"dracula"}}
v1.0.1
```

Supports `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, `prerelease`, `from-git`, or specific versions like `1.2.3`. By default creates git commit and tag unless `--no-git-tag-version` was used to skip.

### pkg

Manage `package.json` data with get, set, delete, and fix operations.

All commands support dot and bracket notation:

```bash terminal icon="terminal" theme={"theme":{"light":"github-light","dark":"dracula"}}
scripts.build              # dot notation
contributors[0]            # array access
workspaces.0               # dot with numeric index
scripts[test:watch]        # bracket for special chars
```

Examples:

```bash terminal icon="terminal" theme={"theme":{"light":"github-light","dark":"dracula"}}
# set
bun pm pkg get name          # single property
bun pm pkg get name version  # multiple properties
bun pm pkg get               # entire package.json
bun pm pkg get scripts.build # nested property

# set
bun pm pkg set name="my-package"                 # simple property
bun pm pkg set scripts.test="jest" version=2.0.0 # multiple properties
bun pm pkg set {"private":"true"} --json         # JSON values with --json flag

# delete
bun pm pkg delete description                  # single property
bun pm pkg delete scripts.test contributors[0] # multiple/nested

# fix
bun pm pkg fix # auto-fix common issues
```
