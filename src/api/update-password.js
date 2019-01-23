"use strict"

const { checkPassword, hashPassword } = require('./libs/util')

function validateParameters() {
  return function(req, res, next) {
    if (!(req.body && 
          req.body.username && 
          req.body.password && req.body.password.length > 0 &&
          req.body.newPassword && req.body.newPassword.length > 0)) {
      res.status(400).send('bad request')    
    } else {
      next()
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

function verifyUserPassword() {
  return function(req, res, next) {
    if (checkPassword(req.user, req.body.password)) {
      next()
    } else {
      res.status(401).send('wrong password')
    }
  }
}

function updatePassword(helpers) {
  return function(req, res) {
    const uid = req.user.uid
    const password = hashPassword(req.body.newPassword)
    helpers.Collections.Users.update({ uid }, { credentials: { password } }, (err, updated) => {
      if (err) {
        res.status(500).send('DB access failed')
      } else {
        res.status(200).send('updated')
      }
    })
  }
}

module.exports = [validateParameters, findUser, verifyUserPassword, updatePassword]
