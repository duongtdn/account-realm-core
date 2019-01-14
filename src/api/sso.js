"use strict"

const jwt = require('jsonwebtoken')

const { generateAuthenToken, serializeUser } = require('./libs/util')
const html = require('../clients/templates/html')

function validateParameters(helpers) {
  return function(req, res, next) {
    if (!(req.query && req.query.realm && req.query.app)) {
      console.log('Request error: missing realm or app in query')
      const data = { error: {code: 400, detail: 'bad request'} }
      res.writeHead( 400, { "Content-Type": "text/html" } )
      res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      return
    }
    const realm = req.query.realm
    const app = req.query.app
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        req.app = apps[0]    
        req.realm = realm    
        next()
      } else {
        const data = { error: {code: 403, detail: 'noapp'} }
        res.writeHead( 403, { "Content-Type": "text/html" } )
        res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      }
    })    
  }
}

function decodeCookie() {
  return function(req, res, next) {
    const cookies = req.cookies
    const app = req.app
    if (!cookies || !cookies.session) {
      const data = { targetOrigin: app.url, status: 200, session: null }
      res.end(html({title: 'SSO', style: false, data, script: `${process.env.CDN}/sso.js`}))
      return
    }
    const session = JSON.parse(cookies.session)
    if (!session.uid) {
      const data = { targetOrigin: app.url, error: {code: 400, detail: 'bad request'} }
      res.writeHead( 400, { "Content-Type": "text/html" } )
      res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      return
    }
    jwt.verify(session.uid, process.env.AUTH_KEY_COOKIE_ENCODE || 'AUTH_KEY_COOKIE_ENCODE', (err, decoded) => {
      if (err) {
        const data = { targetOrigin: app.url, error: {code: 400, detail: 'bad request'} }
        res.writeHead( 400, { "Content-Type": "text/html" } )
        res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

function findUser(helpers) {
  return function(req, res, next) {
    const uid = req.uid
    const app = req.app
    helpers.Collections.Users.find({ uid }, (users) => {
      if (users && users[0]) {
        req.user = users[0]
        next()
      } else {
        const data = { targetOrigin: app.url, error: {code: 404, detail: 'no user'} }
        res.writeHead( 404, { "Content-Type": "text/html" } )
        res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      }
    })    
  }
}

function response() {
  return function(req, res) {
    const realm = req.realm
    const app = req.app
    const data = { targetOrigin: app.url, realm, status: 200, session: { user: serializeUser(req.user), token: req.authenToken } }
    res.end(html({title: 'SSO', style: false, data, script: `${process.env.CDN}/sso.js`}))
  }
}

module.exports = [validateParameters, decodeCookie, findUser, generateAuthenToken, response]
