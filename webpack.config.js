/**
 * Created by glenn on 30.04.17.
 * Last updated on 29.10.17.
 */

const { resolve } = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

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
    filename: ifProd('[name].[chunkhash].js', '[name].js'),
    path: resolve(__dirname, 'assets'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          resolve(__dirname, 'src'),
        ],
        use: {
          // https://webpack.js.org/loaders/babel-loader
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime', 'babel-plugin-transform-object-rest-spread'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader' }),
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
          options: { limit: 8192 },
        },
      },
    ],
  },
  plugins: [
    // Code Splitting - CSS
    new ExtractTextPlugin(ifProd('[name].[chunkhash].css', '[name].css')),

    // Code Splitting - Libraries
    new webpack.optimize.CommonsChunkPlugin({
      // https://stackoverflow.com/q/39548175/2013891
      names: [
        'polyfills',
        'vendor',
        'manifest',
      ],
    }),

    // Caching
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      favicon: './src/favicon.ico',
    }),
    new InlineManifestWebpackPlugin(),

    ...ifProd(
      [
        // Building for Production
        // new webpack.LoaderOptionsPlugin({ minimize: true }), - not needed anymore?
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
      ],
      [
        new webpack.NoEmitOnErrorsPlugin(),

        // HMR
        new webpack.HotModuleReplacementPlugin(),
      ]
    ),

    // Scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  devtool: ifProd('source-map', 'eval'),
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

function ifProd(prodStuff, devStuff) {
  return (process.env.NODE_ENV === 'production') ? prodStuff : devStuff;
}

module.exports = config;
