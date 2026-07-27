# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Igor Fernando Casita's personal portfolio site — a fork of Brittany Chiang's [v4](https://github.com/bchiang7/v4) portfolio template, rebuilt on Gatsby 3 + React 17 + styled-components, with added bilingual (en/pt) support and academic/blog content sections. Deployed to GitHub Pages under the `/Portfolio` path prefix.

## Commands

```sh
yarn                # install dependencies (use yarn, not npm — see yarn.lock)
npm run develop      # start dev server (gatsby develop)
npm run build        # production build (gatsby build)
npm run serve        # serve the production build locally to preview it
npm run clean        # clear the Gatsby .cache and public folders (use when build state gets weird)
npm run format       # prettier --write across js/jsx/json/md
npm run deploy       # gatsby build --prefix-paths && gh-pages -d public (publishes to GitHub Pages)
```

There is no test suite or lint script wired into package.json (`lint-staged` runs `eslint --fix` + `prettier` only on pre-commit via husky, on `*.{js,css,json,md}`). To lint manually, run eslint directly (config is `@upstatement/eslint-config/react` via `.eslintrc`).

Node version is pinned in `.nvmrc` (14.16.0) — use `nvm install`/`nvm use` if working outside a container.

## Architecture

**Content-driven pages via `gatsby-source-filesystem` + `gatsby-transformer-remark`.** Most sections of the site (jobs, academic degrees/certifications/courses, projects, blog posts) are *not* hardcoded in JSX — they're markdown files under `content/` with frontmatter, queried via GraphQL (`allMarkdownRemark`) inside the corresponding component in `src/components/sections/`. To add/edit a job, degree, or blog post, edit/add markdown in `content/`, not the component.

- `content/jobs/<Company>/index.md` — read by [jobs.js](src/components/sections/jobs.js)
- `content/academic/degrees/<Degree>/index.md` — read by academic-featured.js
- `content/academic/certifications/index.md`, `content/academic/courses/index.md`
- `content/projects/*.md` — "other noteworthy projects" grid + archive page
- `content/featured/<Project>/` — featured project case studies
- `content/posts/<slug>/` — blog posts ("Pensieve"), rendered via `src/templates/post.js`, listed at `src/pages/pensieve/index.js`, tag pages generated per-tag by `src/templates/tag.js`

Frontmatter shape is explicitly declared in `gatsby-node.js` (`createSchemaCustomization`) — when adding new frontmatter fields, add them there too or GraphQL queries will silently return `null`.

**Bilingual content via a dual mechanism, not a single i18n layer:**
1. UI strings (nav, headings, static copy) go through `gatsby-plugin-intl` + `react-intl`'s `<FormattedMessage>`, backed by `src/intl/en.json` / `src/intl/pt.json`.
2. Markdown content (jobs, degrees, posts) is duplicated per language as sibling files: `index.md` (English, implicit `lang: en`) and `index.pt.md` (`lang: 'pt'` set in frontmatter). Components query *all* markdown nodes and then filter client-side by comparing `frontmatter.lang` (defaulting to `'en'` when absent) against `useIntl().locale`. See the filtering pattern in [jobs.js](src/components/sections/jobs.js) and [pensieve/index.js](src/pages/pensieve/index.js) — follow this same pattern for any new bilingual content type rather than introducing a different i18n approach.

`gatsby-config.js` sets `redirect: true` on `gatsby-plugin-intl`, so `/` auto-redirects to `/en/` or `/pt/`. `Layout.js` has to special-case root paths across both locales and the `/Portfolio` prefix (see the `isHome` check) to decide whether to show the intro loader animation.

**Path aliases** (set up in `gatsby-node.js` → `onCreateWebpackConfig`, not in a jsconfig/tsconfig): `@components`, `@config`, `@fonts`, `@hooks`, `@images`, `@pages`, `@styles`, `@utils` all resolve to `src/<dir>`. Use these instead of relative `../../` imports.

**Component barrel file**: [src/components/index.js](src/components/index.js) re-exports everything (including section components under aliased names, e.g. `Degress` = academic-featured, `Certifications` = academic-grid). Pages import from `@components`, not individual files — add new shared components here too.

**Deployment quirk**: `pathPrefix: '/Portfolio'` in `gatsby-config.js` means the site is served from a subpath on GitHub Pages. Any hardcoded absolute link/path logic (see `Layout.js`'s `isHome` check) must account for both the bare paths (dev server) and `/Portfolio`-prefixed paths (production).

**Styling**: styled-components throughout, theme tokens (colors, mixins, breakpoints) centralized in `src/styles/` (`theme.js`, `variables.js`, `mixins.js`, `GlobalStyle.js`). Site config (social links, nav links, colors, scroll-reveal defaults) lives in `src/config.js` — update social/nav links there, not inline in components.

**Animation**: `scrollreveal` (wrapped by `src/utils/sr.js`) drives on-scroll section reveals; `animejs` and `react-spring` are used for the interactive background/globe (`interactive-background.js`, `globe.js` with d3-geo/topojson). Both `scrollreveal` and `animejs` are null-loaded during SSR/build-html in `gatsby-node.js` since they're browser-only.
