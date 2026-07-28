import { css } from 'styled-components';

const variables = css`
  :root {
    /* Dark theme (default) */
    --dark-navy: #020c1b;
    --navy: #0a192f;
    --light-navy: #112240;
    --lightest-navy: #233554;
    --navy-shadow: rgba(2, 12, 27, 0.7);
    --dark-slate: #495670;
    --slate: #8892b0;
    --light-slate: #a8b2d1;
    --lightest-slate: #ccd6f6;
    --white: #e6f1ff;
    --green: #64ffda;
    --green-tint: rgba(100, 255, 218, 0.1);
    --pink: #f57dff;
    --blue: #57cbff;
    --nav-bg: rgba(10, 25, 47, 0.85);
    --surface-tint: rgba(17, 34, 64, 0.3);
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.05);

    /* Fixed dark surface for canvas/data-viz widgets whose drawn colors
       (bright teal strokes) only read against a dark backdrop — stays
       constant across themes so it never gets overridden below. */
    --canvas-bg: #0a192f;

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
    --dark-navy: #ffffff;
    --navy: #f7f9fc;
    --light-navy: #ffffff;
    --lightest-navy: #e2e8f0;
    --navy-shadow: rgba(15, 23, 42, 0.12);
    --dark-slate: #94a3b8;
    --slate: #475569;
    --light-slate: #334155;
    --lightest-slate: #0f172a;
    --white: #0f172a;
    --green: #0d9488;
    --green-tint: rgba(13, 148, 136, 0.08);
    --pink: #c026d3;
    --blue: #0284c7;
    --nav-bg: rgba(255, 255, 255, 0.85);
    --surface-tint: rgba(15, 23, 42, 0.035);
    --glass-bg: rgba(15, 23, 42, 0.025);
    --glass-border: rgba(15, 23, 42, 0.08);
  }
`;

export default variables;
