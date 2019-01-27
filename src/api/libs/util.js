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

function encodeCookie(user) {
  return JSON.stringify({
    uid: jwt.sign({uid: user.uid}, process.env.COOKIE_AUTHEN_KEY),
    clientId: Math.random().toString(36).substr(2,9)
  })
}

function decodeCookie(cookies) {
  return new Promise((resolve, reject) => {
    const session = JSON.parse(cookies.session)
    if (!session.uid) {
      reject('invalid_session')
      return
    }
    jwt.verify(session.uid, process.env.COOKIE_AUTHEN_KEY, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve({ uid: decoded.uid, clientId: session.clientId })
      }
    })
  })
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

module.exports = { generateAuthenToken, encodeCookie, decodeCookie, serializeUser, checkPassword, hashPassword }