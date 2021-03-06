"use strict"

const jwt = require('jsonwebtoken')

const html = require('../clients/templates/html')

function validateParams() {
  return function(req, res, next) {
    if (!(req.params && req.params.token)) {
      _renderError(res, 400, 'Bad request')     
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
        _renderError(res, 404, 'Link does not exist')
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

function setEmailVerified(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    helpers.Collections.Users.update({ uid }, { verified: true }, (err, updated) => {
      if (err) {
        _renderError(res, 500, 'DB access failed')
      } else {
        next()
      }
    })
  }
}

function render(helpers) {
  return function(req, res) {    
    _renderForm(res, 'mailverify', 'Email Verification', req.params.token)            
  }
}

function _renderError(res, code, detail) {
  const data = { error: {code, detail} }
  res.writeHead( code, { "Content-Type": "text/html" } );
  res.end(html({title: 'Error', data, script: `${process.env.CDN}/error.js`}))
}

function _renderForm(res, name, title, token) {
  const data = { token }
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title, data, script: `${process.env.CDN}/${name}.js`}))
}

module.exports = [validateParams, decodeToken, setEmailVerified, render]

