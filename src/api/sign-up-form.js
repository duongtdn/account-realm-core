"use strict"

const html = require('../clients/templates/html')

function render(helpers) {
  return function(req, res) {
    if (!(req.query && req.query.realm && req.query.app)) {
      _renderError(res, '403 Forbidden', 'Application is not registered')
      return
    }
    const realm = req.query.realm
    const app = req.query.app
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        _renderSignup(res, apps[0])
      } else {
        _renderError(res, '403 Forbidden', 'Application is not registered')
      }
    })
  }
}

function _renderError(res, code, detail) {
  const data = { error: {code, detail} }
  res.writeHead( 403, { "Content-Type": "text/html" } );
  res.end(html({title: 'Error', data, script: `${process.env.CDN}/error.js`}))
}

function _renderSignup(res, app) {
  const data = { targetOrigin: app.url}
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title: 'Signup', data, script: `${process.env.CDN}/signup.js`}))
}

module.exports = render
