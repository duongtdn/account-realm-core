"use strict"

const { checkPassword, generateAuthenToken, encodeCookie, serializeUser } = require('./libs/util')

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

/*
currently, check if user has joined a realm to allow user to sign in to that realm.
In future, cross realm sign in shoud be allowed. when user sign in success, popup
a consent form asking whether user allows app to access to realm resource
*/
function findUser(helpers) {
  return function(req, res, next) {   
    helpers.Collections.Users.find({username: req.body.username}, (users) => {
      if (users && users[0] && users[0].realms[req.realm]) {
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

function setHttpCookie() {
  return function(req, res, next) {    
    const cookie = encodeCookie(req.user)
    res.cookie('session', cookie, { httpOnly: true })
    next()      
  }
}

function final() {
  return function(req, res) {
    res.status(200).json({ user: serializeUser(req.user), token: req.authenToken })
  }
}

module.exports = [validateParameters, findUser, verifyPassword, generateAuthenToken, setHttpCookie, final]
