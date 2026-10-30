// @ts-check

const remarkMath = require('remark-math').default;
const rehypeKatex = require('rehype-katex').default;
const katexMacros = require('./src/katexMacros');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Math Study',
  tagline: 'Estudo de matematica com explicacoes, exercicios e graficos interativos.',
  favicon: 'img/favicon.svg',

  url: 'https://bobboyms.github.io',
  baseUrl: '/math-study/',
  organizationName: 'bobboyms',
  projectName: 'math-study',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex, {macros: katexMacros}]],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // As lições do Cálculo 1 moraram em /calculo/<lição> até o capítulo
        // Cálculo ganhar subdivisões. Os endereços antigos continuam valendo.
        createRedirects(existingPath) {
          if (existingPath.includes('/calculo/calculo-1')) {
            return [existingPath.replace('/calculo/calculo-1', '/calculo')];
          }
          return undefined;
        },
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP',
      crossorigin: 'anonymous',
    },
    {
      href: 'https://cdn.jsdelivr.net/npm/jsxgraph@1.11.1/distrib/jsxgraph.css',
      type: 'text/css',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Math Study',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'studySidebar',
            position: 'left',
            label: 'Estudos',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Math Study - ${new Date().getFullYear()}`,
      },
      prism: {
        additionalLanguages: ['python'],
      },
    }),
};

module.exports = config;
