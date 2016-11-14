# Gitlab Merge Reuqest Concourse Resource

A concourse resource to check for new merge requests on GitLab

## Usage

```yaml
resources:
- name: gitlab-mr
  type: gitlab-merge-request
  source:
    gitlab_host: gitlab.swisscloud.io
    project_path: 123
    private_key: XXX
```

* `gitlab_host` is the host of your GitLab server (without the `https://`)
* `project_path` is the ID or path of your project
* `private_key` is your GitLab user's private key (can be found in your profile)

## Build Docker Image

1. Run `docker build -t gitlab-merge-request-resource .`

## Test locally

1. Run `docker run -it --rm gitlab-merge-request-resource /opt/resource/check '{"source":{"gitlab_host":"gitlab.swisscloud.io","project_path":1461,"private_token":"XXX"},"version":{"source_branch":"feature/1","updated_at":"2016-11-02T10:22:08.000Z"}}'`
