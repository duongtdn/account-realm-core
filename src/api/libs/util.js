"use strict"

const jwt = require('jsonwebtoken')

const crypto = require('crypto')

function generateAuthenToken(helpers) {
  return function(req, res, next) {
    const user = req.user
    const realm = req.realm
    helpers.Collections.Realms.find({ realmId: realm }, (realms) => {
      if (realms && realms[0]) {
        const secret = realms[0].secret
        req.authenToken = jwt.sign({ uid: user.uid }, secret)  
        next()
      } else {
        console.error('Database Error: Cannot get realm from Realms collection')
        res.status(400).json({error: `Realm ${realm} is unknown`})
      }
    })        
  }
}

function setHttpCookie() {
  return function(req, res, next) {    
    const user = req.user
    const uid = jwt.sign(
      {uid: user.uid}, 
      process.env.AUTH_KEY_COOKIE_ENCODE || 'AUTH_KEY_COOKIE_ENCODE'
    );    
    const clientId = Math.random().toString(36).substr(2,9)
    const session = { uid, clientId }
    const cookie = JSON.stringify(session)
    res.cookie('session', cookie, { httpOnly: true })
    next()
  }
}

function serializeUser(user) {
  const _user = {...user}
  delete _user.uid
  delete _user.credentials
  return _user
}

function checkPassword(user, password) {
  return user.credentials.password === hashPassword(password)
}

function hashPassword(password) {
  const hash = crypto.createHash('sha256')
  const head = process.env.PWD_PREFIX
  const tail = process.env.PWD_SUFFIX
  hash.update(`${head}${password}${tail}`)
  return hash.digest('hex')
}

module.exports = { generateAuthenToken, setHttpCookie, serializeUser, checkPassword, hashPassword }