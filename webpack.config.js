/**
 * Created by glenn on 30.04.17.
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
        use: 'url-loader?limit=8192',
      },
    ],
  },
  plugins: [
    // Code Splitting - CSS
    new ExtractTextPlugin(ifProd('[name].[chunkhash].css', '[name].css')),

    // Code Splitting - Libraries
    new webpack.optimize.CommonsChunkPlugin({
      names: [
        'polyfills',
        'vendor',
        'manifest',
      ],
      minChunks: Infinity,
    }),

    // Caching
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      favicon: './src/favicon.ico',
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest',
    }),

    ...ifProd(
      [
        // Building for Production
        new webpack.LoaderOptionsPlugin({ minimize: true }),
        new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
      ],
      [
        new webpack.NoEmitOnErrorsPlugin(),

        // HMR
        new webpack.HotModuleReplacementPlugin(),
      ]
    ),
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
