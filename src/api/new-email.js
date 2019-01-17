"use strict"

const html = require('../clients/templates/html')

function validateRequest(helpers) {
  return function(req, res, next) {
    const {email, template, realm, app} = req.body
    if (!(realm && app && email && template)) {
      _renderError(res, '400', 'Bad Request')
      return
    }
    helpers.Collections.Apps.find({realm,app}, (apps) => {
      if (apps && apps[0]) {
        req.realm = realm
        req.app = apps[0]
        next()
      } else {
        _renderError(res, '400', 'Bad Request')
      }
    })    
  }
}

function findUser(helpers) {
  return function(req, res, next) {   
    helpers.Collections.Users.find({username: req.body.email}, (users) => {
      if (users && users[0]) {
        req.user = users[0]
        next()
      } else {
        res.status(403).send('forbidden')
      }
    })    
  }
}

function createToken() {
  return function(req, res, next) {
    req.token = 'token'
    next()
  }
}

function sendEmail(helpers) {
  return function (req, res, next) {
    const {email, template, realm, app} = req.body
    const token = req.token
    if (helpers.sendEmail) {
      helpers.sendEmail({
        recipient: [{ email, name: req.user.profile.displayName }],
        template,
        data: { token }
      })
      .then(_ => next())
      .catch(err => {
        const message1 = `We are failed to send email to ${req.body.email}. It may be because of our system failure or your email cannot be reached. Please try again sometime later.`
        const message2 = `We are sorry for the inconvenience.`
        _renderEmailSentStatus(res, "Send Email Failed", req.realm, req.app, message1, message2)
      })
    } else {
      console.error(`Error: there is no function sendEmail`)
      _renderError(res, '500', 'Opps! Some thing wrong in our side. Please try again later. Sorry for inconvenience')
    }
  }
}

function render() {
  return function(req, res) {
    const message1 = `An email has been sent to ${req.body.email}. Please check your inbox and follow the instruction.`
    const message2 = `Thank you.`
    _renderEmailSentStatus(res, "Email Sent", req.realm, req.app, message1, message2)
  }
}

function _renderEmailSentStatus(res, title, realm, app, message1, message2) {
  const data = { targetOrigin: app.url, realm, message1, message2, title }
  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end(html({title, data, script: `${process.env.CDN}/emailsent.js`}))
}

function _renderError(res, code, detail) {
  const data = { error: {code, detail} }
  res.writeHead( 403, { "Content-Type": "text/html" } );
  res.end(html({title: 'Error', data, script: `${process.env.CDN}/error.js`}))
}

module.exports = [validateRequest, findUser, createToken, sendEmail, render]