/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 280:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 260:
/***/ ((module) => {

module.exports = eval("require")("@octokit/rest");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { Octokit } = __nccwpck_require__(260)
const core = __nccwpck_require__(280)

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

  core.debug(repos)

  const changelog_messages = []

  repos.data.map(async (repo) => {
    const prs = await octokit.rest.search.issuesAndPullRequests({
      q: `type:pr+repo:fluffytal-es/${repo.name}`,
      per_page: 100
    })

    core.debug(prs)

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

})();

module.exports = __webpack_exports__;
/******/ })()
;