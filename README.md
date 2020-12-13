# Overview

dendron-11ty is a port of [dendron-jekyll](https://github.com/dendronhq/dendron-jekyll) from jekyll to eleventy.

dendron-11ty is currently a work in progress and is not meant to be used in production (and non-production) environments.

# Setup

yarn

```sh
env WS_ROOT="" ENGINE_PORT=3006 npx eleventy --watch --serve
```

- open `http://localhost:8080/notes/b0fe6ef7-1553-4280-bc45-a71824c2ce36.html`

# Tasks
- [ ] make the arrows smaller on the nav
- [ ] migrate search functionality 
    - [x] build search data
    - [ ] integrate search js fields
- [x] load notes based on dynamic pages
- [x] render dendron specific markdown 
- [ ] restrict published notes based on dendron site configuration
