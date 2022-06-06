const { Octokit } = require('@octokit/rest')
const core = require('@actions/core')

const octokit = new Octokit({
  auth: core.getInput('token')
})

const mergeAndCreateChangelog = async () => {
  const repos = await octokit.rest.repos
    .listForOrg({
      org: 'FluffyTal-es',
      type: 'private',
      per_page: 1000
    })

  const changelog_messages = []

  repos.data.map(async (repo) => {
    const prs = await octokit.rest.search.issuesAndPullRequests({
      q: `type:pr+repo:FluffyTal-es/${repo.name}`,
      per_page: 100
    })

    core.debug(json.encode(prs))

    prs.data.items.map(async (pr) => {
      /*await github.rest.pulls.createReview({
        event: "APPROVE",
        owner: repo.owner,
        repo: repo.repo,
        pull_number: pr.number
      })

      await github.rest.pulls.merge({
        merge_method: "merge",
        owner: repo.owner,
        repo: repo.repo,
        pull_number: pr.number
      })*/
      
      core.debug(pr.title)
      changelog_messages.push(pr.title)
    })
  })

  return changelog_messages
}

(async () => {
  try {
    const changelogs = await mergeAndCreateChangelog()
    core.debug(changelogs)
    return core.setOutput('changelogs', JSON.stringify(changelogs))
  } catch (error) {
    core.setFailed(error.message)
  }
})()
