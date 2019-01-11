"use strict"

const uuid = require('uuid/v1')
const jwt = require('jsonwebtoken')

function validateParameters() {
  return function(req, res, next) {
    const realm = req.body.realm
    if (!realm) {
      res.status(400).send('realm is missing')
      return
    }
    const user = req.body.user
    if (!user || !user.email) {
      res.status(400).send('bad user object')
      return
    }
    next()
  }
}

function checkUserExistance(helpers) {
  return function(req, res, next) {
    const user = req.body.user    
    helpers.Collections.Users.find({username: user.email}, (users) => {
      if (users && users[0]) {
        res.status(403).send('email is used for an account')
      } else {
        next()
      }
    })    
  }
}

function createUser(helpers) {
  return function(req, res, next) {

    const profile = { ...req.body.user.profile }
    // mark empty field as N/A if any
    for (let prop in profile) {
      if (typeof profile[prop] === 'string' && profile[prop].length === 0) {
        profile[prop]  = 'N/A'
      }
    }
    if (profile.gender && profile.gender === 'female') {
      profile.picture = process.env.DEFAULT_FEMALE_PICTURE
    } else {
      profile.picture = process.env.DEFAULT_MALE_PICTURE
    }

    const user = {
      username: req.body.user.email.toLowerCase().trim(),
      uid: uuid(),
      credentials: { password: req.body.user.password },
      profile,
      verified: false,
      createdAt: (new Date()).getTime()
    }

    helpers.Collections.Users.insert({ user }, (user) => {
      if (user) {
        req.user = user
        next()
      } else {
        res.status(500).send('failed to create user')
      }
    })

  }
}

function generateAuthenToken(helpers) {
  return function(req, res, next) {
    const user = req.user
    const realm = req.body.realm
    helpers.Collections.Realms.find({ realmId: realm }, (realms) => {
      if (realms && realms[0]) {
        const secret = realms[0].secret
        req.authenToken = jwt.sign({ uid: user.uid }, secret)  
        next()
      } else {
        console.error('Database Error: Cannot get realm from Realms collection')
        res.status(500).json({error: 'Database error'})
      }
    })        
  }
}

function sendEmail(helpers) {
  return function(req, res, next) {
    if (helpers.sendEmail) {
      /* generate token to active email */
      const user = req.user
      const token = jwt.sign(
        {uid: user.uid}, 
        process.env.DELIGATE_KEY_VERIFY_EMAIL || 'DELIGATE_KEY_VERIFY_EMAIL'
      )   
      helpers.sendEmail({
        recipient: [{ email: user.profile.email[0], name: user.profile.displayName }],
        template: 'verifyemail',
        data: { token }
      }).catch(err => console.warn(`User ${user.profile.displayName}[${user.profile.email[0]}] is created. But failed to send verification email`))      
    }
    next()
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

function responseSuccess() {
  return function(req, res) {
    res.status(200).json({ user: serializeUser(req.user), token: req.authenToken })
  }
}

function serializeUser(user) {
  delete user.uid
  delete user.credentials
  return user
}

module.exports = [validateParameters, checkUserExistance, createUser, generateAuthenToken, sendEmail, setHttpCookie, responseSuccess]
