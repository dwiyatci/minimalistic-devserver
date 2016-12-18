/**
 * Created by glenn on 8/5/16.
 */

const _ = require('lodash');
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const prodEnabled = (env === 'PROD');

  return {
    devtool: prodEnabled ? 'source-map' : 'eval',
    resolve: {
      modules: [
        'node_modules',
        resolve(__dirname, 'src'),
      ],
      extensions: ['.js', '.json', '.html', '.css'],
    },
    entry: {
      vendor: [
        'lodash',
        'jquery',
      ],
      app: [
        'babel-polyfill',
        './src/app.js',
      ],
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            resolve(__dirname, 'src'),
          ],
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-runtime'],
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader',
          }),
        },
        {
          test: /\.(png|gif|jpg)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
        // the url-loader uses DataUrls.
        // the file-loader emits files.
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
          loader: 'url-loader',
          options: {
            limit: 1000,
          },
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file-loader',
        },
      ],
    },
    plugins: _.compact([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),

      new HtmlWebpackPlugin({
        template: './src/index.html',
        //favicon: './src/favicon.ico',
        filename: 'index.html',
      }),

      new ExtractTextPlugin('[name].css'),

      prodEnabled ? new webpack.optimize.UglifyJsPlugin({ sourceMap: true }) : 0,
      prodEnabled ? new webpack.LoaderOptionsPlugin({ minimize: true }) : 0,
    ]),
    devServer: {
      contentBase: resolve(__dirname, 'dist'),
      compress: true,
      noInfo: true,
      historyApiFallback: true,
    },
    performance: {
      hints: false,
    }
  };
};
