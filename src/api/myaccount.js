"use strict"

const html = require('../clients/templates/html')

function render(helpers) {
  return function(req, res) {
    const data = {  }
    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end(html({title: 'My Account', data, script: `${process.env.CDN}/myaccount.js`}))
  }
}

module.exports = render