const { Octokit } = require('@octokit/rest')
const core = require('@actions/core')

const octokit = new Octokit({
  auth: core.getInput('token')
})

const mergeAndCreateChangelog = async () => {
  await octokit.rest.users.getAuthenticated()

  const repos = await octokit.rest.repos
    .listForOrg({
      org: 'FluffyTal-es',
      type: 'private',
      per_page: 1000
    })

  const changelog_messages = await repos.data.map(async (repo) => {
    const prs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
      owner: 'FluffyTal-es',
      repo: repo.name
    })

    const titles = await prs.data.map(async (pr) => {
      try {
        await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
          owner: 'FluffyTal-es',
          repo: repo.name,
          pull_number: pr.number
        })
  
        await octokit.rest.pulls.merge({
          merge_method: "merge",
          owner: 'FluffyTal-es',
          repo: repo.name,
          pull_number: pr.number
        })
      } catch(e) {
        console.log(e)
      }

      return pr.title
    }) 

    return Promise.all(titles)
  })

  return Promise.all(changelog_messages)
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const changelogs = await mergeAndCreateChangelog()

    const logs = []

    changelogs.forEach(l => {
      if (l.length > 0) {
        logs.push(...l)
      }
    })

    return core.setOutput('changelogs', logs.join("\\n - "))
  } catch (error) {
    core.setFailed(error.message)
  }
})()
