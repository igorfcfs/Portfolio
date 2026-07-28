const { palette } = require('./styles/palette');

module.exports = {
  email: 'igorf.casita@gmail.com',

  socialMedia: [
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/igor-fernando-casita/',
    },
    {
      name: 'Lattes',
      url: 'https://lattes.cnpq.br/1338256166847172',
    },
    {
      name: 'Orcid',
      url: 'https://orcid.org/0009-0009-8052-9804',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/igorfcfs',
    },
    {
      name: 'Whatsapp',
      url: 'https://wa.me/5511930442308',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/igorcasita/',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Education',
      url: '/#education',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    accent: palette.dark.accent,
    navy: palette.dark.navy,
    darkNavy: palette.dark['dark-navy'],
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
