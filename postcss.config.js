const tailwind = require('tailwindcss')('./tailwind.js')
const purgeCSS = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/pug/**/*.pug'
  ],
  whitelist: ['html', 'body'],
  whitelistPatternsChildren: [],
  extractors: [
    {
      extractor: class TailwindExtractor {
        static extract (content) {
          return content.match(/[A-Za-z0-9-_:/]+/g) || []
        }
      },
      // Specify the file extensions to include when scanning for
      // class names.
      extensions: ['html', 'js', 'pug']
    }
  ]
})

const simpleVars = require('postcss-simple-vars')
const cssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')({
  browsers: ['last 2 versions', 'iOS >= 8']
})
const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true
      }
    }
  ]
})

const plugins = [tailwind, simpleVars, cssImport]

module.exports = ({ env }) => {
  if (env === 'production') {
    plugins.push(purgeCSS)
  }

  plugins.push(autoprefixer, cssnano)

  return {
    plugins: plugins
  }
}
