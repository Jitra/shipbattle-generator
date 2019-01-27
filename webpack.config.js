const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin');
const pkg = require('./package.json');
const webpack = require('webpack');
const path = require('path');
const name = 'board-generator';

let plugins = [new CopyPkgJsonPlugin({
  new: {
    name: pkg.name,
    author: pkg.author,
    description: pkg.description,
    version: pkg.version,
    main: `${name}.min.js`,
    license: 'MIT',
    dependencies: {},
    devDependencies: pkg.devDependencies
  }
})];

module.exports = (env = {}) => {
  if (env.production) {
    plugins.push(new webpack.BannerPlugin(`${name} - ${pkg.version}`));
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
      library: 'BoardGenerator',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    devServer: {
      contentBase: path.resolve(__dirname, './'),
      publicPath: path.resolve(__dirname, '/lib/')
    },
    module: {
      rules: [
        {
          test: /\.json/,
          use: {loader: 'file-loader', options: {context: path.resolve(__dirname)}}
        },
        {
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader',
            options: {
              inline: true
            }
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: /src/
        }
      ]
    },
    plugins: plugins
  };
};
