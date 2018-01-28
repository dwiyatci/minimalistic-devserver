/**
 * Created by glenn on 05.08.16.
 * Last updated on 29.01.18.
 */

const { resolve } = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

module.exports = (env) => {
  const config = {
    mode: eitherProdOrDev('production', 'development'),
    // output: {
    //   filename: eitherProdOrDev('[name].[chunkhash].js', '[name].js'),
    // },
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
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          // use: ExtractTextPlugin.extract({ use: 'css-loader' }),
          use: 'css-loader',
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: 'url-loader?limit=8192',
        },
        {
          test: /\.json$/,
          type: 'json',
        },
      ],
    },
    plugins: [
      // Code Splitting - CSS
      // new ExtractTextPlugin(eitherProdOrDev('[name].[chunkhash].css', '[name].css')),

      // Caching
      // new HtmlWebpackPlugin({
      //   template: './src/index.ejs',
      //   favicon: './src/favicon.ico',
      // }),
      // new InlineManifestWebpackPlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
    devServer: {
      contentBase: resolve(__dirname, 'dist'),
      compress: true,
      noInfo: true,
      historyApiFallback: true,
      hot: true,
      https: true,
    },
  };

  return config;

  function eitherProdOrDev(prodStuff, devStuff) {
    return (env && env.production) ? prodStuff : devStuff;
  }
};
