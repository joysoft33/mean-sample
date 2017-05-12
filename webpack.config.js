const nodeExternals = require('webpack-node-externals');
const MinifierPlugin = require('babili-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PRODUCTION = process.env.NODE_ENV === 'production';

const serverConfig = {
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [nodeExternals()],
  entry: path.resolve('./server.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve('./client'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(true)
        }
      }]
    }],
  },
  plugins: [
    PRODUCTION && new MinifierPlugin(),
  ].filter(e => e),
};

const clientConfig = {
  output: {
    path: path.resolve('./dist/public'),
    filename: 'bundle.js',
  },
  entry: path.resolve('./client/js/index.js'),
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve('./client'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(false)
        }
      }]
    }]
  },
  plugins: [
    PRODUCTION && new MinifierPlugin(),
  ].filter(e => e),
};

// Notice that both configurations are exported
module.exports = [serverConfig, clientConfig];