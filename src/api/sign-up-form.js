"use strict"

const React = require('react')
const { renderToString } = require('react-dom/server')

const html = require('../clients/templates/html')
const SignUp = require('../../build/components/SignUp')
const Error = require('../../build/components/Error')

function render(helpers) {
  return function(req, res) {
    if (!(req.query && req.query.realm && req.query.app)) {
      _renderError(res, 403, 'Forbidden')
      return
    }
    const realm = req.query.realm
    const app = req.query.app
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        _renderSignup(res, apps[0])
      } else {
        _renderError(res, 403, 'Forbidden')
      }
    })
  }
}

function _renderError(res, code, detail) {
  const reactDom = renderToString(React.createElement(Error.default,{code, detail}))
  res.writeHead( 403, { "Content-Type": "text/html" } );
  res.end(html({title: 'Error', dom: reactDom}))
}

function _renderSignup(res, app) {
  const data = { targetOrigin: app.url}
  const reactDom = renderToString(React.createElement(SignUp.default))
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title: 'Signup', data, dom: reactDom, script: `${process.env.CDN}/signup.js`}))
}

module.exports = render
