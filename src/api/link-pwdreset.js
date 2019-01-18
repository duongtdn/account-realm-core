"use strict"

const jwt = require('jsonwebtoken')

const html = require('../clients/templates/html')

function validateParams() {
  return function(req, res, next) {
    if (!(req.params && req.params.token)) {
      _renderError(res, '400 Bad request', '')     
    } else {
      next()
    }
  }
}

function decodeToken() {
  return function(req, res, next) {
    const token = req.params.token
    jwt.verify(token, process.env.EMAIL_SIGN_KEY, (err, decoded) => {
      if (err) {
        _renderError(res, '404', 'Link does not exist')
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

function render(helpers) {
  return function(req, res) {    
    _renderForm(res, 'pwdreset', 'New Password', req.params.token)            
  }
}

function _renderError(res, code, detail) {
  const data = { error: {code, detail} }
  res.writeHead( 403, { "Content-Type": "text/html" } );
  res.end(html({title: 'Error', data, script: `${process.env.CDN}/error.js`}))
}

function _renderForm(res, name, title, token) {
  const data = { token }
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title, data, script: `${process.env.CDN}/${name}.js`}))
}

module.exports = [validateParams, decodeToken, render]

