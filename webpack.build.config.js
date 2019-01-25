"use strict"

const path = require("path");

module.exports = {
  entry: {
    signup: ['./src/clients/scripts/sign-up.js'],
    error: ['./src/clients/scripts/error.js'],
    sso: ['./src/clients/scripts/sso.js'],
    signin: ['./src/clients/scripts/sign-in.js'],
    requestresetpassword: ['./src/clients/scripts/request-reset-password.js'],
    emailsent: ['./src/clients/scripts/email-sent.js'],
    pwdreset: ['./src/clients/scripts/pwdreset.js'],
    mailverify: ['./src/clients/scripts/mailverify.js'],
    myaccount: ['./src/clients/scripts/myaccount.js']
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