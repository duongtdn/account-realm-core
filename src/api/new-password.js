"use strict"

const jwt = require('jsonwebtoken')

const { hashPassword } = require('./libs/util')

function validateParameters() {
  return function(req, res, next) {
    if (!(req.body && req.body.token && req.body.password && req.body.password.length > 0)) {
      res.status(400).send('bad request')    
    } else {
      next()
    }
  }
}

function decodeToken() {
  return function(req, res, next) {
    const token = req.body.token
    jwt.verify(token, process.env.EMAIL_SIGN_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send('forbidden')  
      } else {
        req.uid = decoded.uid
        next()
      }
    })
  }
}

function updatePassword(helpers) {
  return function(req, res) {
    const uid = req.uid
    const password = hashPassword(req.body.password)
    helpers.Collections.Users.update({ uid }, { credentials: { password } }, (err, updated) => {
      if (err) {
        res.status(500).send('DB access failed')
      } else {
        res.status(200).send('success')
      }
    })
  }
}

module.exports = [validateParameters, decodeToken, updatePassword]