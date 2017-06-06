const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const BabiliPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

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
      enforce: 'pre',
      test: /\.js$/,
      use: [{
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true
        }
      }]
    }, {
      test: /\.js$/,
      include: path.resolve('server'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(true),
          cacheDirectory: true
        }
      }]
    }],
  },
  plugins: [
    PRODUCTION && new BabiliPlugin({
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      entryOnly: false,
      raw: true
    })
  ].filter(e => e),
  devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
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
    filename: '[name].js',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      use: [{
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: true
        }
      }]
    }, {
      test: /\.js$/,
      include: path.resolve('client'),
      exclude: /node_modules/,
      use: [{
        loader: 'ng-annotate-loader'
      }, {
        loader: 'babel-loader',
        options: {
          presets: require('./babelrc.js')(false),
          cacheDirectory: true
        }
      }]
    }, {
      test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot|wav|mp3|ico)$/,
      use: [
        'url-loader?limit=1'
      ]
    }, {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              minimize: PRODUCTION
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
    PRODUCTION && new BabiliPlugin({
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('client/index.html'),
      favicon: path.resolve('client/favicon.ico')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({
        resource
      }) => /node_modules/.test(resource)
    })
  ].filter(e => e),
  devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
};

// Notice that both configurations are exported
module.exports = [serverConfig, clientConfig];