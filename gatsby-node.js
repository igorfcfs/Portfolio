/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');

// --- CORREÇÃO DO ERRO DE DATA AQUI ---
// Isso define explicitamente os tipos do Frontmatter para evitar erros de inferência
// --- CORREÇÃO DO ERRO DE DATA E LANG AQUI ---
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Certification {
      name: String
      code: String
      year: String
      provider: String
      url: String
      badge: File @fileByRelativePath
    }
    type Institute {
      name: String
      language: String
      level: String
      url: String
      start: Date @dateformat
      end: Date @dateformat
      image: File @fileByRelativePath
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      title: String
      date: Date @dateformat
      slug: String
      company: String
      location: String
      range: String
      url: String
      github: String
      external: String
      tech: [String]
      showInProjects: Boolean
      cover: File @fileByRelativePath
      logo: File @fileByRelativePath

      # ADICIONADOS AGORA:
      lang: String
      tags: [String]
      description: String
      draft: Boolean
      certifications: [Certification]
      institutes: [Institute]
    }
  `;
  createTypes(typeDefs);
};
// -------------------------------------

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/posts/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create post detail pages
  const posts = result.data.postsRemark.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: postTemplate,
      context: {},
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });
};

// Gatsby's built-in file-loader/url-loader rules (fonts, images, media, misc
// assets) hash filenames via loader-utils, which defaults to MD4 when no hash
// type is given. Node 17+'s OpenSSL 3 provider rejects MD4, crashing the
// build with "digital envelope routines::unsupported" — normally worked
// around with NODE_OPTIONS=--openssl-legacy-provider. Forcing an explicit
// sha256 through loader-utils' `[hashType:hash:digestType:length]` template
// syntax avoids MD4 entirely, so that flag is no longer needed.
const SAFE_HASH_NAME = 'static/[name]-[sha256:hash:hex:8].[ext]';
const fileOrUrlLoader = /[\\/](file|url)-loader[\\/]/;

const useSafeAssetHash = rule => {
  if (!Array.isArray(rule.use)) return rule;
  return {
    ...rule,
    use: rule.use.map(use =>
      use && fileOrUrlLoader.test(use.loader || '')
        ? { ...use, options: { ...use.options, name: SAFE_HASH_NAME } }
        : use
    ),
  };
};

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
  const config = getConfig();
  config.module.rules = config.module.rules.map(useSafeAssetHash);
  actions.replaceWebpackConfig(config);

  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
          {
            test: /miniraf/,
            use: loaders.null(),
          },
          {
            // Only the fiber/drei wrappers touch browser-only APIs (canvas,
            // WebGL context) at module scope. Bare `three` is pure JS/math
            // (Curve, Vector3, materials) and robot-hero.js constructs a
            // number of THREE.* instances at module scope, so it must stay
            // real during SSR or those constructions throw.
            test: /@react-three[\\/](fiber|drei)/,
            use: loaders.null(),
          },
          {
            test: /@use-gesture/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};