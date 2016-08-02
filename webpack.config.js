'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var socketModule = path.join(__dirname, '/node_modules/socket.io-client/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js'),
  io = path.join(socketModule, 'socket.io.js');


module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'client/js/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      {
        test: /pixi.js/,
        loader: "script" 
      },
      {
        test: /phaser-split.js/,
        loader: "script"
      },
      {
        test: /p2.js/,
        loader: "script"
      },
      {
        test: /socket.io.js/,
        loader: "script"
      },
      {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["es2015", "stage-0"]
      }
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
    }, {
       test: /\.(jpe?g|png|gif|bmp|ico)$/i,
       loader: 'file?name=img/[name].[ext]',
    }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
      'socket.io-client': io,
    },
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', path.join(__dirname, '/client/')],
  }
};