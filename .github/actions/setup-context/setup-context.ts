#!/usr/bin/env bun

/**
 * Setup Publishing Context Script
 *
 * Checks if running from tag and if version is already published.
 * Standalone version for local development and testing.
 *
 * Usage:
 *   bun run setup-context.ts --package <pkg> --registry <url> [--tag-prefix <prefix>] [--ref <ref>]
 *
 * Examples:
 *   bun run setup-context.ts --package @my/pkg --registry https://registry.npmjs.org
 *   bun run setup-context.ts --package @my/pkg --registry https://registry.npmjs.org --ref refs/tags/v1.2.3
 *
 * Environment Variables:
 *   GITHUB_REF - Git reference (defaults to current git ref)
 */

import {$} from 'bun'

interface SetupContextInputs {
  package: string
  registryUrl: string
  tagPrefix: string
  ref: string
}

interface SetupContextOutputs {
  isTag: boolean
  tagVersion: string
  isPublished: boolean
  publishedVersion: string
  shouldPublish: boolean
  alreadyPublished: boolean
}

// Mock core functionality for local development
const core = {
  setFailed: (message: string) => {
    console.error(`❌ FAILED: ${message}`)
    process.exit(1)
  },
  setOutput: (name: string, value: any) => {
    console.log(`::set-output name=${name}::${value}`)
  },
  warning: (message: string) => {
    console.warn(`⚠️  WARNING: ${message}`)
  },
  info: (message: string) => {
    console.log(`ℹ️  ${message}`)
  },
  notice: (message: string) => {
    console.log(`📢 ${message}`)
  },
  startGroup: (name: string) => {
    console.log(`\n▶ ${name}`)
  },
  endGroup: () => {
    console.log('')
  }
}

async function getGitRef(): Promise<string> {
  // Try GITHUB_REF env var first
  if (process.env.GITHUB_REF) {
    return process.env.GITHUB_REF
  }

  // Try to get current branch
  const branch = await $`git symbolic-ref -q HEAD`.nothrow().quiet()
  if (branch.exitCode === 0 && branch.stdout.toString().trim()) {
    return branch.stdout.toString().trim()
  }

  // Fallback: try to get tag
  const tag = await $`git describe --tags --exact-match`.nothrow().quiet()
  if (tag.exitCode === 0 && tag.stdout.toString().trim()) {
    return `refs/tags/${tag.stdout.toString().trim()}`
  }

  return 'refs/heads/main' // Default fallback
}

async function checkRegistryVersion(
  packageName: string,
  registryUrl: string
): Promise<{exitCode: number; stdout: string; stderr: string}> {
  const result = await $`bun info ${packageName} version latest --registry ${registryUrl}`
    .nothrow()
    .quiet()

  return {
    exitCode: result.exitCode,
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString()
  }
}

function parseArgs(): SetupContextInputs {
  const args = process.argv.slice(2)
  const inputs: Partial<SetupContextInputs> = {
    tagPrefix: 'v',
    ref: ''
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const value = args[++i]

      switch (key) {
        case 'package':
          inputs.package = value
          break
        case 'registry':
        case 'registry-url':
          inputs.registryUrl = value
          break
        case 'tag-prefix':
          inputs.tagPrefix = value
          break
        case 'ref':
          inputs.ref = value
          break
      }
    }
  }

  if (!inputs.package || !inputs.registryUrl) {
    console.error(
      'Usage: bun run setup-context.ts --package <pkg> --registry <url> [--tag-prefix <prefix>] [--ref <ref>]'
    )
    process.exit(1)
  }

  return inputs as SetupContextInputs
}

function buildSummaryMarkdown(
  inputs: SetupContextInputs,
  outputs: SetupContextOutputs,
  triggerInfo: Array<[string, string]>,
  warning?: string
): string {
  let summary = '# 📦 Publishing Context\n\n'

  if (warning) {
    summary += `⚠️ **Warning:** ${warning}\n\n`
  }

  // Add trigger information table
  summary += '| Property | Value |\n'
  summary += '|----------|-------|\n'
  for (const [key, value] of triggerInfo) {
    summary += `| ${key} | ${value} |\n`
  }
  summary += '\n'

  // Add status section
  summary += '## Status\n\n'

  if (!outputs.isTag) {
    summary +=
      'ℹ️ **Not a version tag** — Publishing skipped for non-tag triggers\n'
  } else if (outputs.alreadyPublished) {
    summary += `⏭️ **Already Published** — Version \`${outputs.tagVersion}\` already exists in registry\n`
  } else if (outputs.isPublished) {
    summary += `✅ **Ready to Publish** — Version \`${outputs.tagVersion}\` will be published (current: \`${outputs.publishedVersion}\`)\n`
  } else {
    summary += `🚀 **First Publish** — Package \`${inputs.package}\` will be published for the first time\n`
  }

  // Add next steps hint
  if (outputs.shouldPublish) {
    summary += '\n<details>\n<summary>Next Steps</summary>\n\n'
    summary += 'To publish this package:\n\n'
    summary += '```yaml\n'
    summary += '- name: Publish to registry\n'
    summary += "  if: steps.setup-context.outputs.should-publish == 'true'\n"
    summary += `  run: bun publish --registry ${inputs.registryUrl}\n`
    summary += '```\n'
    summary += '</details>\n'
  }

  return summary
}

async function setupContext(): Promise<void> {
  const inputs = parseArgs()

  // Get git ref
  if (!inputs.ref) {
    inputs.ref = await getGitRef()
  }

  // Validate inputs
  if (!inputs.package) {
    core.setFailed('Package name is required')
    return
  }
  if (!inputs.registryUrl) {
    core.setFailed('Registry URL is required')
    return
  }

  // Initialize context
  const ref = inputs.ref
  const tagPattern = `refs/tags/${inputs.tagPrefix}`
  const isTag = ref.startsWith(tagPattern)
  const tagVersion = isTag ? ref.replace(tagPattern, '') : ''

  // Initialize outputs
  const outputs: SetupContextOutputs = {
    isTag,
    tagVersion,
    isPublished: false,
    publishedVersion: '',
    alreadyPublished: false,
    shouldPublish: false
  }

  // Set basic outputs
  core.setOutput('is-tag', isTag)
  core.setOutput('tag-version', tagVersion)

  // Prepare trigger information
  const triggerInfo: Array<[string, string]> = [
    ['Trigger', isTag ? '🏷️ Version Tag' : '🔀 Branch/PR'],
    ['Reference', `\`${ref}\``]
  ]

  let versionWarning: string | undefined

  if (isTag) {
    triggerInfo.push(['Tag Version', `\`${tagVersion}\``])

    // Validate version format
    const semverRegex =
      /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/
    if (!semverRegex.test(tagVersion)) {
      versionWarning = `Tag version "${tagVersion}" doesn't match semver format`
      core.warning(versionWarning)
    }

    // Check registry for existing version
    try {
      core.info(`Checking registry for ${inputs.package}@${tagVersion}...`)

      const {exitCode, stdout} = await checkRegistryVersion(
        inputs.package,
        inputs.registryUrl
      )

      if (exitCode === 0 && stdout.trim()) {
        outputs.publishedVersion = stdout.trim()
        outputs.isPublished = true
        outputs.alreadyPublished = tagVersion === outputs.publishedVersion
        outputs.shouldPublish = !outputs.alreadyPublished

        core.info(`Found published version: ${outputs.publishedVersion}`)

        // Add registry information
        triggerInfo.push(
          ['Registry', `\`${inputs.registryUrl}\``],
          ['Package', `\`${inputs.package}\``],
          ['Latest Published', `\`${outputs.publishedVersion}\``]
        )
      } else {
        // Package not found in registry
        outputs.shouldPublish = true
        core.info(`Package ${inputs.package} not found in registry`)

        triggerInfo.push(
          ['Registry', `\`${inputs.registryUrl}\``],
          ['Package', `\`${inputs.package}\``],
          ['Latest Published', '—']
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      core.warning(`Failed to check registry: ${message}`)
    }
  }

  // Set final outputs
  core.setOutput('is-published', outputs.isPublished)
  core.setOutput('published-version', outputs.publishedVersion)
  core.setOutput('already-published', outputs.alreadyPublished)
  core.setOutput('should-publish', outputs.shouldPublish)

  // Build and display summary
  const summaryMarkdown = buildSummaryMarkdown(
    inputs,
    outputs,
    triggerInfo,
    versionWarning
  )
  console.log('\n' + summaryMarkdown)

  // Log outputs for debugging
  core.startGroup('📊 Publishing Context Outputs')
  console.log(
    JSON.stringify(
      {
        'is-tag': outputs.isTag,
        'tag-version': outputs.tagVersion,
        'is-published': outputs.isPublished,
        'published-version': outputs.publishedVersion,
        'already-published': outputs.alreadyPublished,
        'should-publish': outputs.shouldPublish
      },
      null,
      2
    )
  )
  core.endGroup()

  // Set appropriate exit message
  if (outputs.shouldPublish && outputs.isTag) {
    core.notice(
      `Package ${inputs.package}@${tagVersion} is ready to be published`
    )
  } else if (outputs.alreadyPublished) {
    core.notice(
      `Package ${inputs.package}@${tagVersion} is already published - skipping`
    )
  }
}

// Run if called directly
if (import.meta.main) {
  setupContext().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export {setupContext, type SetupContextInputs, type SetupContextOutputs}
