export const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const navDelay = 1000;
export const loaderDelay = 2000;

const RESUME_FILES = {
  en: 'Igor Fernando C.F. Silva - CV (English).pdf',
  pt: 'Igor Fernando C.F. Silva - CV (Português).pdf',
  es: 'Igor Fernando C.F. Silva - CV (Español).pdf',
  zh: 'Igor Fernando C.F. Silva - CV (Mandarim).pdf',
};

export const getResumePath = locale => `/${RESUME_FILES[locale] || RESUME_FILES.en}`;

export const KEY_CODES = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_LEFT_IE11: 'Left',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_RIGHT_IE11: 'Right',
  ARROW_UP: 'ArrowUp',
  ARROW_UP_IE11: 'Up',
  ARROW_DOWN: 'ArrowDown',
  ARROW_DOWN_IE11: 'Down',
  ESCAPE: 'Escape',
  ESCAPE_IE11: 'Esc',
  TAB: 'Tab',
  SPACE: ' ',
  SPACE_IE11: 'Spacebar',
  ENTER: 'Enter',
};
