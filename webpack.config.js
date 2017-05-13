const nodeExternals = require('webpack-node-externals');
const MinifierPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const NODE_MODULES = path.join(__dirname, './node_modules');
const PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Server options
 */
const serverConfig = {
  target: 'node',
  node: {
    __dirname: true
  },
  entry: {
    server: path.resolve('server.js')
  },
  output: {
    path: path.resolve('dist'),
    filename: 'server.js'
  },
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve('server'),
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      entryOnly: false,
      raw: true
    })
  ].filter(e => e),
  devtool: 'source-map',
};

/**
 * Client application options
 */
const clientConfig = {
  target: 'web',
  entry: {
    index: path.resolve('client/js/index.js')
  },
  output: {
    path: path.resolve('dist/public'),
    filename: '[name].[chunkhash].js',
  },
  //externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve('client'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(false)
        }
      }]
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }]
  },
  plugins: [
    PRODUCTION && new MinifierPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('client/index.html')
    }),
    new ExtractTextPlugin('index.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new CleanObsoleteChunks()
  ].filter(e => e),
  devtool: PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
};

// Run through deps and extract the first part of the path, 
// as that is what you use to require the actual node modules 
// in your code. Then use the complete path to point to the correct
// file and make sure webpack does not try to parse it
if (PRODUCTION) {

  var alias = {};
  var deps = [];

  [
    'angular/angular.min.js',
    'angular-animate/angular-animate.min.js',
    'angular-aria/angular-aria.min.js',
    'angular-material/angular-material.min.js',
    'angular-ui-router/release/angular-ui-router.min.js',
  ]
  .forEach(function (dep) {
    var depPath = path.resolve(NODE_MODULES, dep);
    var name = dep.split(path.sep)[0];
    alias[name] = depPath;
    deps.push(name);
  });

  clientConfig.externals = deps;
  clientConfig.resolve = {
    alias: alias
  };
}

// Notice that both configurations are exported
module.exports = [serverConfig, clientConfig];