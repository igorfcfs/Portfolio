const config = require('./src/config');

// The AI chatbot depends on the /api/chat serverless function, which only
// exists on the Vercel deploy. Enable it on Vercel and in local development;
// keep it off for the static GitHub Pages production build (`npm run deploy`).
if (process.env.VERCEL || process.env.NODE_ENV === 'development') {
  process.env.GATSBY_ENABLE_AI = 'true';
}

module.exports = {
  // GitHub Pages serves the site under /Portfolio; Vercel serves it at the
  // domain root. Only apply the prefix off-Vercel so assets resolve correctly.
  pathPrefix: process.env.VERCEL ? '/' : '/Portfolio',

  siteMetadata: {
    title: 'Igor Fernando Casita',
    description: 'Igor Fernando Casita is a Full Stack Developer & AI Engineer building AI-powered, web, and mobile applications.',
    siteUrl: 'https://igorfcfs.github.io/Portfolio',
    image: '/og.png',
    twitterUsername: '@igorfcfs',
  },
  
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
    
    // 1. INTERNACIONALIZAÇÃO
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        path: `${__dirname}/src/intl`,
        languages: [`en`, `pt`, `es`, `zh`],
        defaultLanguage: `en`,
        // ISSO AQUI FAZ A MÁGICA DA TROCA NO APP
        redirect: true,
      },
    },

    // 2. MANIFESTO (O Ícone do App)
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        // Caminho para a pasta que criamos
        path: `${__dirname}/src/intl`,
        // As línguas que você vai suportar
        languages: [`en`, `pt`, `es`, `zh`],
        // A língua padrão
        defaultLanguage: `en`,
        // Redireciona / para /en automaticamente
        redirect: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Igor Fernando Casita',
        // NOME CURTO OBRIGATÓRIO (Máx 12 chars para garantir o install)
        short_name: 'Igor.Dev', 
        
        // COMEÇA NA RAIZ (Para o plugin de Intl decidir a língua)
        start_url: '/', 
        
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: 'standalone',
        icon: 'src/images/logo.png',

        // Força a atualização do ícone caso mude
        cache_busting_mode: 'none',
      },
    },

    // 3. OFFLINE (Tem que ser o ÚLTIMO da lista de plugins funcionais)
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/en/*`, `/pt/*`, `/es/*`, `/zh/*`], // Garante que as línguas funcionem offline
      },
    },

    // ... Seus sources de imagem e markdown continuam iguais ...
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,   // ou 1400
              quality: 95,
              linkImagesToOriginal: false,
              backgroundColor: 'transparent',
            },
          },
          {
            resolve: 'gatsby-remark-code-titles',
          }, 
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-45666519-2',
      },
    },
  ],
};