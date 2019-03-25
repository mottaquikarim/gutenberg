<!---
{"next": "chapter_4.md","title": "Deployment"}
-->

# Deployment

To deploy the built artifact, connect the forked repo with [Travis](https://travis-ci.org). The travis file included in this repo should handle the rest - it builds the rust dependencies and then pushes to github pages, so once deployed the URL to access the book is:

```
https://[your_github_handle].github.io/[name_of_forked_repo]
```

Please note that NodeJS is only used as a local dependency and is not required to build the artifact. 