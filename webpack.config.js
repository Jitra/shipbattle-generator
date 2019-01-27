const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const webpack = require('webpack');
const path = require('path');
const name = pkg.name;
let plugins = [];

module.exports = (env = {}) => {
  if (env.production) {
    plugins = [
      new webpack.BannerPlugin(`${name} - ${pkg.version}`)
    ];
  } else {
    plugins.push(new HtmlWebpackPlugin({
      template: 'index.html'
    }));
  }

  return {
    mode: env.production ? 'production' : 'development',
    entry: './src',
    output: {
      path: __dirname + '/lib',
      publicPath: path.resolve(__dirname, '/lib/'),
      filename: `${name}.min.js`,
      library: name,
      libraryTarget: 'umd'
    },
    devServer: {
      contentBase: path.resolve(__dirname, './'),
      publicPath: path.resolve(__dirname, '/lib/')
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: /src/
      }]
    },
    plugins: plugins
  };
};
