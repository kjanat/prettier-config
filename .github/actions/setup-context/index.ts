import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {context} from '@actions/github'

const ref = context.ref
const isTag = ref.startsWith('refs/tags/v')
const tagVersion = isTag ? ref.replace('refs/tags/v', '') : ''

core.setOutput('is-tag', isTag)

// Build summary content
core.summary
  .addHeading('📦 Publishing Context', 2)
  .addRaw(`\n- **Ref**: \`${ref}\`\n`)
  .addRaw(`- **Is Tag**: ${isTag}\n`)

if (isTag) {
  core.setOutput('tag-version', tagVersion)
  core.summary.addRaw(`- **Tag Version**: \`${tagVersion}\`\n`)

  const {exitCode, stdout} = await exec.getExecOutput(
    'bun',
    [
      'info',
      process.env.PACKAGE,
      'version',
      'latest',
      '--registry',
      process.env.REGISTRY_URL
    ],
    {ignoreReturnCode: true}
  )

  if (exitCode === 0 && stdout.trim()) {
    const publishedVersion = stdout.trim()
    core.setOutput('is-published', true)
    core.setOutput('published-version', publishedVersion)

    const alreadyPublished = tagVersion === publishedVersion
    core.setOutput('already-published', alreadyPublished)

    core.summary
      .addRaw(`- **Published Version**: \`${publishedVersion}\`\n`)
      .addRaw(
        `- **Status**: ${alreadyPublished ? '⏭️ Already published' : '✅ Ready to publish'}\n`
      )
  } else {
    core.setOutput('is-published', false)
    core.setOutput('already-published', false)

    core.summary
      .addRaw('- **Published Version**: none\n')
      .addRaw('- **Status**: ✅ First publish\n')
  }
} else {
  core.setOutput('is-published', false)
  core.setOutput('already-published', false)

  core.summary.addRaw('- **Status**: ℹ️ Not a version tag\n')
}

// Write summary once at the end
await core.summary.write()
