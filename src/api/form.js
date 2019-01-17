"use strict"

const html = require('../clients/templates/html')

function render(helpers) {
  return function(req, res) {
    if (!(req.query && req.query.name)) {
      _renderError(res, '400 Bad request', 'Form name is not specified')
      return
    }
    if (!(req.query && req.query.realm && req.query.app)) {
      _renderError(res, '403 Forbidden', 'Application is not registered')
      return
    }
    const realm = req.query.realm
    const app = req.query.app
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        const title = req.query.title || 'Form'
        const name = req.query.name
        _renderForm(res, name, title, realm, apps[0], req.query)
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

function _renderForm(res, name, title, realm, app, query) {
  const data = { targetOrigin: app.url, realm, app: app.appId, query }
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title, data, script: `${process.env.CDN}/${name}.js`}))
}

module.exports = render
