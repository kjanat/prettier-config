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

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {context} from '@actions/github'

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

async function getGitRef(): Promise<string> {
  // In CI, use GitHub context
  if (process.env.GITHUB_ACTIONS) {
    return context.ref
  }

  // Try GITHUB_REF env var
  if (process.env.GITHUB_REF) {
    return process.env.GITHUB_REF
  }

  // Try to get current branch
  const branch = await exec.getExecOutput(
    'git',
    ['symbolic-ref', '-q', 'HEAD'],
    {ignoreReturnCode: true, silent: true}
  )
  if (branch.exitCode === 0 && branch.stdout.trim()) {
    return branch.stdout.trim()
  }

  // Fallback: try to get tag
  const tag = await exec.getExecOutput(
    'git',
    ['describe', '--tags', '--exact-match'],
    {ignoreReturnCode: true, silent: true}
  )
  if (tag.exitCode === 0 && tag.stdout.trim()) {
    return `refs/tags/${tag.stdout.trim()}`
  }

  return 'refs/heads/main' // Default fallback
}

async function checkRegistryVersion(
  packageName: string,
  registryUrl: string
): Promise<{exitCode: number; stdout: string; stderr: string}> {
  const result = await exec.getExecOutput(
    'bun',
    ['info', packageName, 'version', 'latest', '--registry', registryUrl],
    {ignoreReturnCode: true, silent: true}
  )

  return {
    exitCode: result.exitCode,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
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

async function buildSummary(
  inputs: SetupContextInputs,
  outputs: SetupContextOutputs,
  triggerInfo: Array<[string, string]>,
  warning?: string
): Promise<void> {
  // Start building summary
  core.summary.addHeading('📦 Publishing Context', 2)

  if (warning) {
    core.summary.addRaw(`\n⚠️ **Warning:** ${warning}\n\n`)
  }

  // Add trigger information table
  core.summary.addTable([
    [
      {data: 'Property', header: true},
      {data: 'Value', header: true}
    ],
    ...triggerInfo.map(([key, value]) => [key, value])
  ])

  // Add status section
  core.summary.addBreak().addHeading('Status', 3)

  if (!outputs.isTag) {
    core.summary.addRaw(
      'ℹ️ **Not a version tag** — Publishing skipped for non-tag triggers\n'
    )
  } else if (outputs.alreadyPublished) {
    core.summary.addRaw(
      `⏭️ **Already Published** — Version \`${outputs.tagVersion}\` already exists in registry\n`
    )
  } else if (outputs.isPublished) {
    core.summary.addRaw(
      `✅ **Ready to Publish** — Version \`${outputs.tagVersion}\` will be published (current: \`${outputs.publishedVersion}\`)\n`
    )
  } else {
    core.summary.addRaw(
      `🚀 **First Publish** — Package \`${inputs.package}\` will be published for the first time\n`
    )
  }

  // Add next steps hint
  if (outputs.shouldPublish) {
    const nextSteps =
      `To publish this package:\n\n` +
      `\`\`\`yaml\n` +
      `- name: Publish to registry\n` +
      `  if: steps.setup-context.outputs.should-publish == 'true'\n` +
      `  run: bun publish --registry ${inputs.registryUrl}\n` +
      `\`\`\`\n`

    core.summary.addBreak().addBreak()
    core.summary.addDetails('Next Steps', nextSteps)
  }

  // Write to file in CI, print to console locally
  if (process.env.GITHUB_ACTIONS) {
    await core.summary.write()
  } else {
    console.log('\n' + core.summary.stringify())
    // Note: Don't call clear() locally as it requires GITHUB_STEP_SUMMARY env var
  }
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
  await buildSummary(inputs, outputs, triggerInfo, versionWarning)

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
