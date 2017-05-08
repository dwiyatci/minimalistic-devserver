/**
 * Created by glenn on 30.04.17.
 */

const { compact } = require('lodash');
const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const prodEnabled = process.env.NODE_ENV === 'production';
const config = {
  entry: {
    app: './src/app.js',
    vendor: [
      'lodash',
      'jquery',
    ],
    polyfills: [
      'babel-polyfill',
    ],
  },
  output: {
    filename: prodEnabled ? '[name].[chunkhash].js' : '[name].js',
    path: resolve(__dirname, 'assets'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', { modules: false }]],
            plugins: ['transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      },
    ],
  },
  plugins: compact([
    // Code Splitting - CSS
    new ExtractTextPlugin(prodEnabled ? '[name].[chunkhash].css' : '[name].css'),

    // Code Splitting - Libraries
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'polyfills',
        'vendor',
        'manifest',
      ],
      minChunks: Infinity,
    }),

    // Building for Production
    prodEnabled && new webpack.LoaderOptionsPlugin({ minimize: true }),
    prodEnabled && new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),

    // Caching
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      favicon: './src/favicon.ico',
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),

    // HMR
    !prodEnabled && new webpack.HotModuleReplacementPlugin(),
  ]),
  devtool: prodEnabled ? 'source-map' : 'cheap-eval-source-map',
  resolve: {
    modules: [
      'node_modules',
      resolve(__dirname, 'src'),
    ],
  },
  devServer: {
    contentBase: resolve(__dirname, 'assets'),
    compress: true,
    noInfo: true,
    historyApiFallback: true,
    hot: true,
    https: true,
  },
};

module.exports = config;
