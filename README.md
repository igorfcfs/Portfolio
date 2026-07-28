# Igor Fernando Casita — Portfolio

Personal portfolio and blog for Igor Fernando Casita, built with [Gatsby](https://www.gatsbyjs.org/) 3, React 17 and styled-components. It started as a fork of Brittany Chiang's [v4](https://github.com/bchiang7/v4) template and has since been extended with trilingual content (EN/PT/ES), an academic/career timeline, a blog ("Pensieve"), an interactive globe, and a light/dark theme system driven from a single color file.

Live site: https://igorfcfs.github.io/Portfolio

## Credits

The layout and visual language started from Brittany Chiang's [v4](https://github.com/bchiang7/v4) portfolio template — please give her credit if you fork this too. Since then, most of what's described below (the theming system, the color system, the globe, the bilingual pipeline, the academic timeline) has been rewritten or added on top of that foundation for this specific site.

## Features

- **Light / dark theme toggle**, persisted across visits and respecting the visitor's OS preference on first load.
- **A single file controls every color on the site** — see [Color system](#color-system--how-to-change-the-theme-colors) below.
- **Trilingual content** (English, Portuguese, Spanish) for both UI strings and long-form content (jobs, degrees, projects, blog posts).
- **Content-driven sections** — jobs, academic degrees/certifications/courses, projects and blog posts are Markdown files under `content/`, not hardcoded JSX.
- An **interactive 3D globe** (d3-geo + Canvas) plotting where the author studied, with a globe/flat-map morph animation.
- A full-page **animated particle background** that reacts to the mouse and to the active theme.
- A blog ("**Pensieve**") with tag pages, syntax-highlighted code blocks, and RSS/sitemap generation.

## Getting started

### Requirements

- Node — the version is pinned in `.nvmrc` (currently `14.16.0`). Run `nvm install && nvm use` if you use [nvm](https://github.com/nvm-sh/nvm).
- Yarn — the project is set up with `yarn.lock`; install with `yarn`, not `npm install`, to avoid a mismatched lockfile.

### Install

```sh
yarn
```

### Run the dev server

```sh
npm run develop
```

Serves the site at `http://localhost:8000` with hot reloading. `npm start` is an alias for the same command.

### Production build

```sh
npm run build
```

### Preview the production build locally

```sh
npm run serve
```

### Deploy

```sh
npm run deploy
```

Runs `gatsby build --prefix-paths` (the site is served from the `/Portfolio` sub-path on GitHub Pages) and publishes the `public/` folder with `gh-pages`.

### Other scripts

- `npm run clean` — clears Gatsby's `.cache` and `public` folders. Use this when the build state gets weird (stale GraphQL schema, phantom errors after renaming content files, etc).
- `npm run format` — runs Prettier across `js`, `jsx`, `json` and `md` files.
- There's no dedicated lint script, but `lint-staged` runs `eslint --fix` + Prettier automatically on every commit (via Husky) for `*.{js,css,json,md}`. To lint by hand, run `eslint` directly — the config is `@upstatement/eslint-config/react`, wired up in `.eslintrc`.

## Project structure

### Content lives in Markdown, not in components

Most sections of the site — jobs, academic degrees, certifications, coursework, projects, blog posts — are **not** hardcoded in JSX. They're Markdown files with frontmatter under `content/`, queried via GraphQL (`allMarkdownRemark`) from the matching component in `src/components/sections/`. To add or edit a job, a degree, or a blog post, edit the Markdown, not the component:

- `content/jobs/<Company>/index.md` → read by `src/components/sections/jobs.js`
- `content/academic/degrees/<Degree>/index.md` → read by `academic-featured.js`
- `content/academic/certifications/index.md`, `content/academic/courses/index.md`
- `content/projects/*.md` → the "other noteworthy projects" grid and archive page
- `content/featured/<Project>/` → featured project case studies
- `content/posts/<slug>/` → blog posts, rendered by `src/templates/post.js`, listed at `src/pages/pensieve/index.js`, with tag pages generated per-tag by `src/templates/tag.js`

Frontmatter shape is declared explicitly in `gatsby-node.js` (`createSchemaCustomization`) — if you add a new frontmatter field, add it there too, or the GraphQL query will silently return `null` instead of erroring.

### Trilingual content, two different mechanisms

1. **UI strings** (nav labels, static headings, buttons) go through `gatsby-plugin-intl` + `react-intl`'s `<FormattedMessage>`, backed by `src/intl/en.json`, `src/intl/pt.json` and `src/intl/es.json`.
2. **Long-form Markdown content** (jobs, degrees, projects, posts) is duplicated per language as sibling files: `index.md` (English, implicit `lang: en`), `index.pt.md` and `index.es.md` (with `lang: 'pt'` / `lang: 'es'` set in frontmatter). Components query *every* markdown node for that content type and filter client-side by comparing `frontmatter.lang` (defaulting to `en` when absent) against `useIntl().locale`. Follow this same pattern for any new bilingual/trilingual content type instead of introducing a different i18n approach.

`gatsby-config.js` sets `redirect: true` on `gatsby-plugin-intl`, so `/` auto-redirects to `/en/`, `/pt/` or `/es/`.

### Path aliases

Set up in `gatsby-node.js` → `onCreateWebpackConfig` (not in a jsconfig/tsconfig): `@components`, `@config`, `@fonts`, `@hooks`, `@images`, `@pages`, `@styles`, `@utils` all resolve to `src/<dir>`. Use these instead of relative `../../` imports.

### Component barrel file

`src/components/index.js` re-exports everything (including section components under aliased names, e.g. `Degress` = `academic-featured`, `Certifications` = `academic-grid`). Pages import from `@components`, not from individual files — add new shared components there too.

### Deployment quirk

`pathPrefix: '/Portfolio'` in `gatsby-config.js` means the site is served from a sub-path on GitHub Pages. Any hardcoded absolute link/path logic (see `Layout.js`'s `isHome` check, which has to special-case root paths across all three locales *and* the `/Portfolio` prefix) needs to account for both the bare paths (dev server) and the `/Portfolio`-prefixed paths (production).

### Styling and animation

- Styled-components throughout. Theme tokens (colors, spacing, breakpoints, mixins) are centralized in `src/styles/` — see the [Color system](#color-system--how-to-change-the-theme-colors) section below for how colors specifically work.
- Site configuration (social links, nav links, scroll-reveal defaults) lives in `src/config.js` — update social/nav links there, not inline in components.
- `scrollreveal` (wrapped by `src/utils/sr.js`) drives on-scroll section reveals; `animejs` and `react-spring` power the interactive background/globe. Both `scrollreveal` and `animejs` are null-loaded during SSR/build-html in `gatsby-node.js` since they're browser-only.

## Adding a new social link (LinkedIn, ORCID, IEEE, etc.)

Social links are **not** hardcoded in the sidebar or footer components — both read from a single array in [`src/config.js`](src/config.js) and render an icon by matching the entry's `name` against a switch statement in [`src/components/icons/icon.js`](src/components/icons/icon.js). There are two cases:

### The icon already exists (e.g. IEEE, ORCID, LinkedIn, GitHub, Twitter, Instagram, Whatsapp, Codepen, AppStore, PlayStore)

Just add an entry to the `socialMedia` array in `src/config.js`:

```js
socialMedia: [
  // ...existing entries...
  {
    name: 'IEEE', // must match a case in icon.js exactly (case-sensitive)
    url: 'https://ieeexplore.ieee.org/author/your-id',
  },
],
```

That's it — `src/components/social.js` (the sidebar) and `src/components/footer.js` (the mobile footer) both map over `socialMedia` and render `<Icon name={name} />`, so the new link shows up in both places automatically.

### The icon doesn't exist yet (a brand new platform)

1. **Create the SVG icon** as its own component under `src/components/icons/<platform>.js`, following the existing pattern (see [`orcid.js`](src/components/icons/orcid.js)):

   ```js
   import React from 'react';

   const IconExample = () => (
     <svg
       xmlns="http://www.w3.org/2000/svg"
       role="img"
       viewBox="0 0 24 24"
       className="icon icon-example"
       fill="currentColor"
     >
       <title>Example</title>
       <path d="..." />
     </svg>
   );

   export default IconExample;
   ```

2. **Export it** from [`src/components/icons/index.js`](src/components/icons/index.js):

   ```js
   export { default as IconExample } from './example';
   ```

3. **Add a case** for it in the `Icon` switch in [`src/components/icons/icon.js`](src/components/icons/icon.js) (import it at the top too):

   ```js
   case 'Example':
     return <IconExample />;
   ```

4. **Add the entry** to `socialMedia` in `src/config.js` with a matching `name: 'Example'`, as in the first case above.

The icon inherits its color via `fill="currentColor"`, so it automatically follows the site's [color system](#color-system--how-to-change-the-theme-colors) — no hardcoded colors needed in the SVG.

## Adding a company logo to a job entry

Each job in `content/jobs/<Company>/index.md` can show a real company logo in the "Professional Experience" section (both in the tab list and in the detail card) via the `logo` frontmatter field. It's declared as a first-class field in `gatsby-node.js` (`logo: File @fileByRelativePath`) and queried/rendered by `src/components/sections/jobs.js`.

If a job has no `logo` set, the section doesn't break or leave a blank space — it automatically falls back to a generated initials badge (the company's first letters on an accent-colored gradient), so this step is optional and purely cosmetic.

To add a real logo:

1. **Drop an image file** in that job's folder, next to its `index.md`:

   ```
   content/jobs/ETEC/
   ├── index.md
   ├── index.es.md
   ├── index.pt.md
   ├── index.zh.md
   └── logo.png   ← add it here
   ```

2. **Reference it in frontmatter.** Add the `logo` line to *every* language variant of that job (`index.md`, `index.pt.md`, `index.es.md`, `index.zh.md`) since they all share the same folder and the same image:

   ```md
   ---
   date: '2024-02-04'
   title: 'Software Developer (Volunteer)'
   company: 'ETEC Taboão da Serra'
   location: 'São Paulo, Brazil'
   range: 'Feb 2024 - Present'
   url: 'https://www.cps.sp.gov.br/etec/'
   logo: 'logo.png'
   ---
   ```

3. **Restart the dev server** (`npm run develop`) if it was already running — Gatsby needs to re-run `createSchemaCustomization` to pick up files referenced by a frontmatter field it hasn't seen before. From there, `gatsby-plugin-image` handles resizing, WebP/AVIF conversion and the blurred placeholder automatically, at whatever size the tab (40px) or the detail card (72px) needs.

Tips for the image itself:

- Keep it roughly square (1:1) — it's rendered inside a rounded-square badge, so a wide rectangular logo will get cropped.
- A transparent PNG (or a PNG exported from an SVG) with the mark centered and little surrounding whitespace looks best; a logo with lots of padding around it will read as tiny inside the badge.
- Don't worry about resolution — `gatsbyImageData(width: 160, ...)` downsamples it internally, so there's no need to hand-resize before adding it.

## Adding a badge image to a certification entry

Certifications in `content/academic/certifications/index.md` can display a **badge image** (e.g., official certification badge from the issuer) in the "Professional Certifications" section via the `badge` frontmatter field. The badge image replaces the bookmark icon on the left side of each certification card and has a white background.

If a certification has no `badge` set, a bookmark icon is displayed instead. This step is optional and purely cosmetic — you can add badges later as you receive them from the certification providers.

To add a badge image:

1. **Prepare the image file** — save the badge image (PNG, JPG, SVG) in the `content/academic/certifications/` folder or organize it in a subfolder:

   ```
   content/academic/certifications/
   ├── index.md
   ├── cs50-badge.png          ← add badge images here
   ├── oracle-gaip-badge.png
   └── python-pcap-badge.png
   ```

2. **Reference it in frontmatter** in the `certifications` array of `content/academic/certifications/index.md`:

   ```yaml
   ---
   certifications:
     - name: "CS50's Introduction to Computer Science"
       code: "3d350461-b8d2-431b-85b3-2ce1ae1b2305"
       year: "2026"
       provider: "Harvard University"
       url: "https://certificates.cs50.io/..."
       badge: "cs50-badge.png"  ← add the badge path here

     - name: "Oracle Cloud Infrastructure 2024 Generative AI Professional"
       code: "1Z0-1127-24"
       year: "2024"
       provider: "Oracle"
       url: "https://brm-certview.oracle.com/..."
       badge: "oracle-gaip-badge.png"
   ---
   ```

3. **Reload the page** — the dev server hot-reloads, so your changes appear immediately.

Tips for badge images:

- **Size**: Badge images are displayed at 50×50px, so keep them square or near-square (1:1 aspect ratio) for the best appearance.
- **Background**: Badge images should have a transparent background or assume a white background (the badge container uses white). Most official certification badges already have this.
- **File format**: Use PNG (for transparent backgrounds) or JPG (for compressed photos). SVG works too if you're exporting vector badges.
- **Resolution**: You don't need to hand-optimize — just use the original badge file from the certification provider, as it will be downsampled automatically.
- **Fallback**: If you leave the `badge` field empty or omit it, the bookmark icon shows instead, which is perfectly fine while waiting for badge images from the provider.

## Color system — how to change the theme colors

**Every color on the site is defined in exactly one place: [`src/styles/palette.js`](src/styles/palette.js).** Nothing else in the codebase should ever contain a hardcoded hex or `rgba()` literal — if you find one, it's a bug.

### Changing the accent color

The accent (`--accent` — buttons, links, hover glows, the globe, the particle background, badges...) is controlled by exactly two lines in `palette.js`:

```js
const dark = {
  // ...
  accent: '#38bdf8', // ← accent color for the dark theme
  // ...
};

const light = {
  // ...
  accent: '#0284c7', // ← accent color for the light theme
  // ...
};
```

Change either hex value and rebuild — every tint, glow, shadow, and canvas-drawn color derived from it updates automatically. It doesn't need to be a shade of the current color; it can be any hue.

Two values instead of one because the dark and light themes need different lightness for contrast: the dark theme wants a bright, saturated accent that pops against a near-black background, while the light theme needs a noticeably darker shade of the same hue so text stays readable (≥ 4.5:1 contrast) on a near-white background. If you only change one of the two, that theme's accent will look inconsistent with the other.

### How the rest of the palette is structured

```js
// palette.js (simplified)
const dark = { 'dark-navy': '#020c1b', navy: '#0a192f', /* ...text/surface colors... */ accent: '#38bdf8' };
const light = { 'dark-navy': '#ffffff', navy: '#f7f9fc', /* ... */ accent: '#0284c7' };

const derive = (base, isDark) => ({
  ...base,
  'accent-tint': alpha(base.accent, 0.1),
  'accent-tint-20': alpha(base.accent, 0.2),
  // ...more derived tints, glows, glass surfaces, shadows...
});

const palette = { dark: derive(dark, true), light: derive(light, false) };
module.exports = { palette, hexToRgb, alpha };
```

- `dark` and `light` hold the **base colors** — the background/surface/text scale (`dark-navy`, `navy`, `light-navy`, `lightest-navy`, `dark-slate`, `slate`, `light-slate`, `lightest-slate`, `white`) plus `accent`, `pink` and `blue`. These are the only values meant to be hand-picked.
- `alpha(hex, opacity)` and `hexToRgb(hex)` are small helper functions (no dependency — just hex parsing) that build `rgba()` strings from a hex color. **Never type out a literal `rgba(r, g, b, a)` string in a component** — if you need a new opacity of an existing color, add it inside `derive()` so it stays tied to its base color.
- `derive()` computes every tint, glow, shadow and "glass" surface color *from* the base colors — things like `accent-tint-20` (a 20%-opacity wash of the accent, used for hover glows) or `navy-shadow` (used in box-shadows). This is what makes the system "change one value, everything updates": component files reference `var(--accent-tint-20)`, never a raw color.
- `palette.js` is written as CommonJS (`module.exports`, not `export`) on purpose: `gatsby-config.js` and `src/config.js` `require()` it directly through plain Node, before Babel/webpack ever run, so it has to work both there and via `import` from React/styled-components code — a `require()` on an ES module would crash the build.

### Where the palette actually gets used

- **`src/styles/variables.js`** loops over `palette.dark` and `palette.light` and generates the two CSS blocks (`:root { ... }` and `:root[data-theme='light'] { ... }`) that expose every entry as a CSS custom property (`--accent`, `--navy`, `--accent-tint-20`, etc). This is the only file that turns the JS palette into real CSS — you should never need to touch it when changing a color.
- **Regular components** consume those custom properties directly, e.g. `color: var(--accent);` or `box-shadow: 0 0 20px var(--accent-tint-20);`.
- **Canvas-drawn visuals** (`src/components/globe.js`, `src/components/sections/interactive-background.js`) can't read CSS custom properties from inside a `<canvas>` 2D context, so they `import { palette, alpha } from '@styles/palette'` and build color strings in JS instead — but they pull from the exact same base values, so they still update automatically when you edit `palette.js`.
- **`src/config.js`** (used by `gatsby-config.js` for the PWA manifest's `theme_color`/`background_color`) also reads its colors from `palette.js`, so the browser tab color and the color the OS shows while the PWA is installing stay in sync with the rest of the site too.

## Light / dark theme toggle

- `src/hooks/useTheme.js` exposes `[theme, toggleTheme]`. Toggling sets `data-theme="light"` (or removes it, for the default dark theme) on `<html>` and persists the choice to `localStorage`.
- `src/components/theme-toggle.js` is the sun/moon button rendered in the desktop nav and the mobile menu sidebar (`src/components/nav.js`, `src/components/menu.js`).
- **No flash of the wrong theme on load**: `gatsby-ssr.js` injects a small inline script (via `onRenderBody` / `setPreBodyComponents`) that runs *before* React hydrates. It reads the saved theme from `localStorage`, falling back to the browser's `prefers-color-scheme`, and sets `data-theme` on `<html>` immediately — so the page never paints in the wrong theme and then flips.
- Every color-driven style transitions smoothly between themes via the `--theme-transition` CSS variable applied broadly in `src/styles/GlobalStyle.js`.

## Recent redesign notes

A few structural things changed recently that are worth knowing if you're extending the site further:

- The classic "flat color block behind a grayscale photo" effect (visible as a solid background color peeking out from behind the About photo, featured project screenshots, and academic/degree images) was removed. Images now show their natural colors, with a subtle border/glow that appears on hover instead.
- The interactive globe (`src/components/globe.js`) sits on a **fixed dark backdrop** (`--canvas-bg`, which does not change between themes) with rounded corners, because its lines are drawn in a bright accent color that would be unreadable directly on the light theme's near-white background.
- The particle background (`src/components/sections/interactive-background.js`) reads its dot/line color from `palette.js` and lowers its opacity in the light theme, so it stays a subtle texture instead of a busy foreground element.

## License

MIT — see the license notice inherited from the original [v4](https://github.com/bchiang7/v4) template. If you fork this repository, please keep crediting Brittany Chiang for the original design this was built on top of.
