check = require('./check');
var payload = {
    source: {
        gitlab_url: 'https://gitlab.swisscloud.io',
        private_token: 'private token',
        project_path: 1461//'appc-devprt/portal-2-0'
    },
    version: {
        updated_at: '2016-11-11T14:11:22.000Z',
        title: 'Feature/5201 space consistency',
        iid: 299,
        source_branch: 'feature/5201-space-consistency',
        author: 'patrick.walther@swisscom.com',
        assignee: 'mathis.kretz@swisscom.com'
    }
};

check(payload)
    .then(function(versions) {
        console.log(versions);
    });