const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const MinifierPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

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
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve('client'),
      exclude: /node_modules/,
      use: [{
        loader: 'ng-annotate-loader'
      }, {
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(false)
        }
      }]
    }, {
      test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot|wav|mp3)$/,
      use: [
        'url-loader?limit=10000',
        'img-loader'
      ]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }]
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      })
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: PRODUCTION
        }
      }]
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    PRODUCTION && new MinifierPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('client/index.html')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({
        resource
      }) => /node_modules/.test(resource)
    }),
    new CleanObsoleteChunks()
  ].filter(e => e),
  devtool: PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
};

// Run through deps and extract the first part of the path, 
// as that is what you use to require the actual node modules 
// in your code. Then use the complete path to point to the correct
// file and make sure webpack does not try to parse it
// if (PRODUCTION) {

//   var externals = [];
//   var alias = {};

//   [
//     {
//       name: 'angular',
//       file: 'angular.min.js'
//     },
//     {
//       name: 'angular-animate',
//       file: 'angular-animate.min.js'
//     },
//     {
//       name: 'angular-aria',
//       file: 'angular-aria.min.js'
//     },
//     {
//       name: 'angular-material',
//       file: 'angular-material.min.js'
//     },
//     {
//       name: 'angular-css',
//       file: 'angular-css.min.js'
//     },
//     {
//       name: 'angular-ui-router',
//       file: 'release/angular-ui-router.min.js'
//     }
//   ]
//   .forEach(function (dep) {
//     var depPath = path.resolve(NODE_MODULES, path.join(dep.name, dep.file));
//     alias[dep.name] = depPath;
//     externals.push(dep.name);
//   });

//   clientConfig.externals = externals;
//   clientConfig.resolve = {
//     alias: alias
//   };
// }

// Notice that both configurations are exported
module.exports = [serverConfig, clientConfig];