const tailwind = require('tailwindcss')('./tailwind.config.js');
const purgeCSS = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/template/**/*.njk',
  ],
  whitelist: ['html', 'body'],
  whitelistPatternsChildren: [],
  extractors: [
    {
      extractor: class TailwindExtractor {
        static extract (content) {
          return content.match(/[A-Za-z0-9-_:/]+/g) || [];
        }
      },
      // Specify the file extensions to include when scanning for
      // class names.
      extensions: ['html', 'js', 'njk'],
    },
  ],
});

const nested = require('postcss-nested');
const atImport = require('postcss-import');
const each = require('postcss-each');
const simpleVars = require('postcss-simple-vars');
const autoprefixer = require('autoprefixer')({
  browsers: ['last 2 versions', 'iOS >= 8'],
});
const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true,
      },
    },
  ],
});

const plugins = [tailwind, nested, atImport, each, simpleVars];

module.exports = ({ options }) => {
  if (options.mode === 'production') {
    plugins.push(purgeCSS);
  }

  plugins.push(autoprefixer, cssnano);

  return {
    plugins: plugins,
  };
};
