'use strict'

const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    toyvdom: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJsPlugin()
  ]
}
