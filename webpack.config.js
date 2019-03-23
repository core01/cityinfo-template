const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')

const generateHtmlPlugins = templateDir => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.filter(item => {
    const parts = item.split('.')

    return !!parts[1]
  }).map(item => {
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/template')

module.exports = (env, argv) => {
  return {
    entry: ['./src/js/main.js', './src/css/main.pcss'],
    output: {
      filename: './js/main.js'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.pcss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.resolve(__dirname, 'css/')
              }
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js'),
                  ctx: { mode: argv.mode }
                }
              }
            }
          ]
        },
        {
          test: /\.njk$/,
          use: [
            'html-loader',
            {
              loader: 'nunjucks-html-loader',
              options: {
                // Other super important. This will be the base
                // directory in which webpack is going to find
                // the layout and any other file index.njk is calling.
                searchPaths: ['./src/template']
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: './css/[name].css',
        chunkFilename: '[id].css'
      }),
      new CopyWebpackPlugin([
        {
          from: './src/images',
          to: './images'
        }
      ])
    ].concat(htmlPlugins)
  }
}
