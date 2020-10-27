/**
 * Created by glenn on 05.08.16.
 * Last updated on 27.10.20.
 */

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const config = {
    mode: eitherDevOrProd('development', 'production'),
    output: {
      filename: eitherDevOrProd('[name].js', '[name].[contenthash].js'),
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            // https://webpack.js.org/loaders/babel-loader
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: [eitherDevOrProd('style-loader', MiniCssExtractPlugin.loader), 'css-loader'],
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: 'url-loader?limit=8192',
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),

      // https://webpack.js.org/plugins/mini-css-extract-plugin/#common-use-case
      ...eitherDevOrProd([], [new MiniCssExtractPlugin({ filename: '[name].[chunkhash].css' })]),

      // Output Management
      // https://webpack.js.org/guides/output-management/#setting-up-htmlwebpackplugin
      // https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder
      // Development
      // https://webpack.js.org/guides/development/#using-watch-mode
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        favicon: './src/favicon.ico',
      }),
    ],
    optimization: {
      // Caching
      // https://webpack.js.org/guides/caching/#extracting-boilerplate
      runtimeChunk: 'single',
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      noInfo: false,
      historyApiFallback: true,
      https: true,
      hot: true,
      publicPath: '/',
    },
    // Persistent Caching
    // https://webpack.js.org/blog/2020-10-10-webpack-5-release/#persistent-caching
    cache: {
      // 1. Set cache type to filesystem
      type: 'filesystem',

      buildDependencies: {
        // 2. Add your config as buildDependency to get cache invalidation on config change
        config: [__filename],

        // 3. If you have other things the build depends on you can add them here
        // Note that webpack, loaders and all modules referenced from your config are automatically added
      },
    },
  };

  return config;

  // Production
  // https://webpack.js.org/guides/production/#specify-the-mode
  function eitherDevOrProd(devStuff, prodStuff) {
    return !(env && env.production) ? devStuff : prodStuff;
  }
};
