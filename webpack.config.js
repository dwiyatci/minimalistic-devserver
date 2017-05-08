/**
 * Created by glenn on 30.04.17.
 */

const { compact } = require('lodash');
const { resolve } = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prodEnabled = process.env.NODE_ENV === 'production';
const config = {
  entry: {
    a: './src/a.js',
    b: './src/b.js',
    vendor: [
      //'jquery',
      //'jquery/dist/jquery.min',
      'jquery/jquery.js',
    ],
  },
  output: {
    filename: prodEnabled ? '[name].[chunkhash].js' : '[name].js',
    path: resolve(__dirname, 'assets'),
    publicPath: '/',
  },
  module: {
    /**
     * You can only use noParse for files that do not have calls to
     * import, require, define or any other importing mechanism.
     * (hint: look at jQuery 1.9.1 vs jQuery 2.1.0).
     */
    noParse: /jquery/,
    rules: [
      {
        test: /(a|b)\.js$/,
        //use: 'imports-loader?$=jquery',
        use: 'imports-loader?$=>window.jQuery',
      },
      //{
      //  test: /jquery/,
      //  use: 'script-loader',
      //},
    ],
  },
  plugins: compact([
    //new webpack.ProvidePlugin({
    //  $: 'jquery'
    //}),

    // Code Splitting - Libraries
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'vendor',
      ],
      minChunks: Infinity,
    }),

    // Caching
    new HtmlWebpackPlugin({ template: './src/index.ejs' }),

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
