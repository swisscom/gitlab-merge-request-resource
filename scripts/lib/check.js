'use strict';

const gitlab = require('node-gitlab');

/**
 * getProject retrieves a gitlab project
 *
 * @param {Object} client A valid GitLab client
 * @param {string} projectPath The path of the project to retrieve
 * (currently only the project ID is working)
 * @returns {Promise} The project
 */
function getProject(client, projectPath) {
  const project = client.projects.get({ id: projectPath });

  return project;
}

/**
 * getOpenMergeRequests retrieves all open merge requests of a GitLab project
 *
 * @param {Object} client A valid GitLab client
 * @param {string} projectId The ID of the project
 * @returns {Promise} All open merge requests
 */
function getOpenMergeRequests(client, projectId) {
  const openMergeRequests = client.mergeRequests.list({
    id: projectId,
    state: 'opened',
    order_by: 'updated_at',
  });

  return openMergeRequests;
}

/**
 * getNewMergeRequest identifies a new merge requests out of a list
 *
 * @param {Array} mergeRequestList The total list of merge requests
 * @param {Object} version The old version coming from Concourse
 * @returns {Array} All new merge requests
 */
function getNewMergeRequest(mergeRequestList, version) {
  const newVersions = [];
  const updDateVersion = new Date(version.updated_at);

  mergeRequestList.sort((a, b) => {
    const aUpdated = new Date(a.updated_at);
    const bUpdated = new Date(b.updated_at);

    return aUpdated > bUpdated;
  });

  for (let i = 0; i < mergeRequestList.length; i++) {
    const updDateMr = new Date(mergeRequestList[i].updated_at);

    if (updDateMr > updDateVersion) {
      newVersions.push(createVersion(mergeRequestList[i]));
    }
  }

  // If the given version is already the latest,
  // an array with that version as the sole entry should be listed.
  if (newVersions.length === 0) {
    newVersions.push(version);
  }

  return newVersions;
}

/**
 * createVersion creates a formatted version object
 * from a merge request
 *
 * @param {Object} mergeRequest The merge request to format
 * @returns {Object} version
 */
function createVersion(mergeRequest) {
  const version = {
    source_branch: mergeRequest.source_branch,
    updated_at: mergeRequest.updated_at,
  };

  return version;
}

/**
 * check returns the version
 *
 * @param {Object} payload The payload coming from Concourse
 * @returns {Promise} version
 */
function check(payload) {
  const client = gitlab.createPromise({
    api: `https://${payload.source.gitlab_host}/api/v3`,
    privateToken: payload.source.private_token,
  });

  return getProject(client, payload.source.project_path)
    .then((project) =>
      getOpenMergeRequests(client, project.id)
    )
    .then((openMergeRequests) =>
      getNewMergeRequest(openMergeRequests, payload.version)
    )
    .catch((err) => console.error(err));
}

module.exports = check;
