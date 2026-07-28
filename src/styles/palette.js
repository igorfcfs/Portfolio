/**
 * Single source of truth for every color in the site.
 *
 * Edit a hex value in `dark` or `light` below and everything derived from
 * it — CSS custom properties, tints, glows, shadows, the canvas-based globe
 * and particle background, even the PWA manifest colors — updates with it.
 * Nothing outside this file should ever hardcode a color literal; add a new
 * derived token here instead and reference it by name.
 *
 * Written as CommonJS (not `export`) on purpose: gatsby-config.js requires
 * this file directly through plain Node, before Babel/webpack are involved,
 * so it needs to work with a bare `require()` there as well as with
 * `import` from React/styled-components code.
 */

const hexToRgb = hex => {
  const stripped = hex.replace('#', '');
  const full = stripped.length === 3 ? stripped.split('').map(c => c + c).join('') : stripped;
  const int = parseInt(full, 16);
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
};

// Builds an rgba() string from a hex color + opacity — use this instead of
// ever typing out a literal rgba(r, g, b, a) string.
const alpha = (hex, opacity) => `rgba(${hexToRgb(hex)}, ${opacity})`;

// --- Base colors — the only values you should ever need to change ---
// `accent` is the site's single brand color (buttons, links, glows, the
// globe, the particle background...). It can be any hue, not just green —
// change these two lines and everything derived from it follows.

const dark = {
  'dark-navy': '#020c1b',
  navy: '#0a192f',
  'light-navy': '#112240',
  'lightest-navy': '#233554',
  'dark-slate': '#495670',
  slate: '#8892b0',
  'light-slate': '#a8b2d1',
  'lightest-slate': '#ccd6f6',
  white: '#e6f1ff',
  accent: '#38bdf8',
  pink: '#f57dff',
  blue: '#57cbff',
};

const light = {
  'dark-navy': '#ffffff',
  navy: '#f7f9fc',
  'light-navy': '#ffffff',
  'lightest-navy': '#e2e8f0',
  'dark-slate': '#94a3b8',
  slate: '#475569',
  'light-slate': '#334155',
  'lightest-slate': '#0f172a',
  white: '#0f172a',
  accent: '#0284c7',
  pink: '#c026d3',
  blue: '#0284c7',
};

// Canvas-drawn visuals (globe.js, interactive-background.js) sit on a
// backdrop that stays dark in both themes, so they always read off `dark`.
const canvasBg = dark.navy;

// Every tint/glow/shadow/surface below is COMPUTED from the base colors
// above via alpha() — never hand-write a new rgba() literal in a component,
// add the opacity you need here so it stays tied to the base color.
const derive = (base, isDark) => ({
  ...base,
  'navy-shadow': isDark ? alpha('#02060f', 0.7) : alpha(light['lightest-slate'], 0.12),
  'accent-tint': alpha(base.accent, 0.1),
  'accent-tint-20': alpha(base.accent, 0.2),
  'accent-tint-30': alpha(base.accent, 0.3),
  'accent-tint-40': alpha(base.accent, 0.4),
  'accent-tint-50': alpha(base.accent, 0.5),
  'nav-bg': alpha(base.navy, 0.85),
  'surface-tint': isDark ? alpha(dark['light-navy'], 0.3) : alpha(light['lightest-slate'], 0.035),
  'glass-bg': isDark ? alpha('#ffffff', 0.03) : alpha(light['lightest-slate'], 0.025),
  'glass-border': isDark ? alpha('#ffffff', 0.05) : alpha(light['lightest-slate'], 0.08),
  'canvas-bg': canvasBg,
});

const palette = {
  dark: derive(dark, true),
  light: derive(light, false),
};

module.exports = { palette, hexToRgb, alpha };
