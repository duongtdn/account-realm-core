"use strict"

const React = require('react')
const { renderToString } = require('react-dom/server')

const html = require('../../clients/templates/html')
const Signup = require('../../build/components/sign-up-form')

function render(helpers) {
  return function(req, res) {
    const reactDom = renderToString(React.createElement(Signup.default))
    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end(html({title: 'Signup', dom: reactDom}))
  }
}

module.exports = render
