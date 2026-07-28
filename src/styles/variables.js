import { css } from 'styled-components';
import { palette } from './palette';

// Generates `--name: value;` lines from a palette object — this is what
// actually turns a palette.js edit into a live CSS custom property.
const toCssVars = theme =>
  Object.entries(theme)
    .map(([name, value]) => `--${name}: ${value};`)
    .join('\n    ');

const variables = css`
  :root {
    /* Dark theme (default) — colors come from src/styles/palette.js */
    ${toCssVars(palette.dark)}

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    --theme-transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease,
      box-shadow 0.3s ease;

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  /* Light theme overrides — toggled via data-theme="light" on <html> */
  :root[data-theme='light'] {
    ${toCssVars(palette.light)}
  }
`;

export default variables;
