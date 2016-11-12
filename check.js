function check (payload) {
    var gitlab = require('node-gitlab');
    var _ = require('lodash');

    var client = gitlab.createPromise({
        api: payload.source.gitlab_url +  '/api/v3',
        privateToken: payload.source.private_token
    });

    function getProject(projectPath) {
        return client.projects.get({id: projectPath})
    }

    function getOpenMergeRequests(projectId) {
        return client.mergeRequests.list({id: projectId, state: 'opened', order_by: 'updated_at', sort: 'desc'});
    }

    function getNewMergeRequests(mergeRequestList, version) {
        return _.map(_.filter(mergeRequestList, function(mr) {
            var updDateMr = new Date(mr.updated_at);
            var updDateVersion = new Date(version.updated_at);
            return updDateMr > updDateVersion;
        }), versionFromMergeRequest);
    }

    function versionFromMergeRequest(mergeRequest) {
        return {iid: mergeRequest.iid,
                title: mergeRequest.title,
                source_branch: mergeRequest.source_branch,
                updated_at: mergeRequest.updated_at,
                author: mergeRequest.author.email,
                assignee: mergeRequest.assignee.email};
    }

    return getProject(payload.source.project_path)
        .then(function(project) {
            return getOpenMergeRequests(project.id)
        })
        .then(function (openMergeRequests) {
            return getNewMergeRequests(openMergeRequests,payload.version);
        })
}

module.exports = check;