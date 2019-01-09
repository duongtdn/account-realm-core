"use strict"

const React = require('react')
const { renderToString } = require('react-dom/server')

const html = require('../clients/templates/html')
const SignUp = require('../../build/components/SignUp')

function render(helpers) {
  return function(req, res) {
    const data = { targetOrigin: 'http://localhost:3200'}
    const reactDom = renderToString(React.createElement(SignUp.default))
    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end(html({title: 'Signup', data, dom: reactDom, script: `${process.env.CDN}/signup.js`}))
  }
}

module.exports = render
