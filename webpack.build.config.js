"use strict"

const path = require("path");

module.exports = {
  entry: {
    signup: ['./src/clients/scripts/sign-up.js'],
    error: ['./src/clients/scripts/error.js']
  },
  output: {
    path: path.resolve(__dirname, "build/clients"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /(\.js?$)|(\.jsx?$)/,
        use: 'babel-loader',    
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map'
}