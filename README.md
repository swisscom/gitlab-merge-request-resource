# GitLab Merge Request Concourse Resource

A concourse resource to check for new merge requests on GitLab and update the merge request status.

## Source Configuration

```yaml
resource_types:
- name: merge-request
  type: docker-image
  source:
    repository: mastertinner/gitlab-merge-request-resource

resources:
- name: repo-mr
  type: merge-request
  source:
    gitlab_host: gitlab.com
    project_path: myname/myproject
    private_token: XXX
    username: my_username
    password: xxx
```

* `gitlab_host` is the host of your GitLab server (without the `https://`)
* `project_path` is the path of your project
* `private_token` is your GitLab user's private token (can be found in your profile)
* `username` is the username for HTTP(S) auth when pulling
* `password` is the password for HTTP(S) auth when pulling

## Behavior

### `check`: Check for new merge requests

Checks if there are new merge requests or merge requests with new commits.

### `in`: Clone merge request source branch

`git clone`s the source branch of the respective merge request.

### `out`: Update a merge request's merge status

Updates the merge request's `merge_status` which displays nicely in the GitLab UI and allows to only merge changes if they pass the test.

#### Parameters

* `repository`: The path of the repository of the merge request's source branch
* `status`: The new status of the merge request (`pending`, `running`, `success`, `failed`, or `canceled`)

## Example

```yaml
jobs:
- name: test-merge-request
  plan:
  - get: repo
    resource: repo-mr
    trigger: true
  - put: merge-request
    params:
      repository: repo
      status: running
  - task: run-tests
    file: merge-requests/ci/tasks/run-tests.yml
  on_failure:
    put: merge-request
    params:
      repository: repo
      status: failed
  on_success:
    put: merge-request
    params:
      repository: repo
      status: success
```
