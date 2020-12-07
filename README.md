# Overview

dendron-11ty is a port of [dendron-jekyll](https://github.com/dendronhq/dendron-jekyll) from jekyll to eleventy.

dendron-11ty is currently a work in progress and is not meant to be used in production (and non-production) environments.

# Setup

yarn

```sh
npx eleventy --watch --serve
node bin/build-styles.js
```

- open `http://localhost:8080/`

# Tasks
- [ ] make the arrows smaller on the nav
- [ ] migrate search functionality 
- [ ] load notes based on dynamic pages
    https://www.11ty.dev/docs/pages-from-data/
- [ ] restrict published notes based on dendron site configuration