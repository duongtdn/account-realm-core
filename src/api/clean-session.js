"use strict"

const html = require('../clients/templates/html')

function done(helpers) {
  return function(req, res) {
    if (!(req.query && req.query.realm && req.query.app)) {
      console.log('Request error: missing realm or app in query')
      const data = { error: {code: 400, detail: 'bad request'} }
      res.writeHead( 400, { "Content-Type": "text/html" } );
      res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      return
    }
    const realm = req.query.realm
    const app = req.query.app
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        console.log('clear session cookie')
        res.clearCookie('session')
        const data = { targetOrigin: apps[0].url, realm, session: null }
        console.log(data)
        res.writeHead( 200, { "Content-Type": "text/html" } );
        res.end(html({title: 'Clean', style: false, data, script: `${process.env.CDN}/sso.js`}))
      } else {
        console.log(`app ${app} is not registered`)
        const data = { error: {code: 403, detail: 'noapp'} }
        res.writeHead( 403, { "Content-Type": "text/html" } );
        res.end(html({title: 'Error', style: false, data, script: `${process.env.CDN}/error.js`}))
      }
    })
  }
}

module.exports = done
