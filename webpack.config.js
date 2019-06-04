const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const generateHtmlPlugins = templateDir => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.filter(item => {
    const parts = item.split('.');

    return !!parts[1];
  }).map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
};

const htmlPlugins = generateHtmlPlugins('./src/template');

module.exports = (env, argv) => {
  return {
    mode: argv.mode === 'production' ? 'production' : 'development',
    entry: {
      main: [
        './src/js/main.js',
        './src/css/main.css',
      ],
      'company-card': [
        './src/js/company-card.js',
      ],
      'app': [
        './src/app/index.tsx',
      ],
    },
    output: {
      filename: './js/[name].js',
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
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    'modules': false,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                '@babel/preset-react',
                '@babel/preset-env',
              ],
              plugins: [
                'react-css-modules',
                ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                'react-hot-loader/babel',
              ],
            },
          },
        },
        {
          test: /\.module\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          ],
        },
        {
          test: /^(?!.*?\.module).*\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.resolve(__dirname, 'css/'),
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(__dirname, 'postcss.config.js'),
                  ctx: { mode: argv.mode },
                },
              },
            },
          ],
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
                searchPaths: ['./src/template'],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.tsx', '.ts'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: './css/[name].css',
        chunkFilename: '[id].css',
      }),
      new CopyWebpackPlugin([
        {
          from: './src/images',
          to: './images',
        },
      ]),
      new Dotenv(),

    ].concat(htmlPlugins),
    optimization: {
      minimizer: [new UglifyJSPlugin({
        extractComments: 'all',
      })],
    },
  };
};
