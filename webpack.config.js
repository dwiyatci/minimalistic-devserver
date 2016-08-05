/**
 * Created by glenn on 8/5/16.
 */

const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
  const prodEnabled = env && env.prod;

  return {
    devtool: prodEnabled ? 'source-map' : 'eval',
    resolve: {
      modules: [resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['', '.js', '.css', '.html', '.json'],
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
    plugins: [
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

      //new ExtractTextPlugin('[name].css'),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [
            resolve(__dirname, 'src'),
          ],
          exclude: [
            resolve(__dirname, 'src/vendor'),
          ],
          loader: 'babel',
          query: {
            //presets: ['es2015-webpack', 'stage-2'],
            presets: ['es2015', 'stage-2'],
            plugins: ['transform-runtime'],
          },
        },
        //{
        //  test: /\.css$/,
        //  loader: ExtractTextPlugin.extract('style', 'css'),
        //},
        // the url-loader uses DataUrls.
        // the file-loader emits files.
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
          // loader: "url?limit=10000"
          loader: 'url',
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          loader: 'file',
        },
        {
          test: /\.(png|gif|jpg)$/,
          loader: 'url?limit=8192',
        },
        {
          test: /\.html$/,
          include: [
            resolve(__dirname, 'src'),
          ],
          loader: 'html',
        },
        {
          test: /\.json$/,
          include: [
            resolve(__dirname, 'src'),
          ],
          loader: 'json',
        },
      ],
    },
    devServer: {
      contentBase: 'dist/',
      noInfo: true,
      historyApiFallback: true,
    },
  };
}
