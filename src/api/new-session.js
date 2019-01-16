"use strict"

const { checkPassword, generateAuthenToken, setHttpCookie, serializeUser } = require('./libs/util')

function validateParameters() {
  return function(req, res, next) {
    const realm = req.body.realm
    if (!realm) {
      res.status(400).send('realm is missing')
      return
    }
    req.realm = realm
    if (req.body.username && req.body.password) {
      next()
    } else {
      res.status(400).send('bad user object')
    }
  }
}

function findUser(helpers) {
  return function(req, res, next) {   
    helpers.Collections.Users.find({username: req.body.username}, (users) => {
      if (users && users[0]) {
        req.user = users[0]
        next()
      } else {
        res.status(404).send('no user')
      }
    })    
  }
}

function verifyPassword() {
  return function(req, res, next) {
    if (checkPassword(req.user, req.body.password)) {
      next()
    } else {
      res.status(401).send('wrong password')
    }
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({ user: serializeUser(req.user), token: req.authenToken })
  }
}

module.exports = [validateParameters, findUser, verifyPassword, generateAuthenToken, setHttpCookie, final]
