"use strict"

const uuid = require('uuid/v1')
const jwt = require('jsonwebtoken')

const { hashPassword, generateAuthenToken, encodeCookie, serializeUser } = require('./libs/util')

function validateParameters() {
  return function(req, res, next) {
    const realm = req.body.realm
    if (!realm) {
      res.status(400).send('realm is missing')
      return
    }
    req.realm = realm
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

    const realms = { account: true }
    realms[req.realm] = true

    const user = {
      username: req.body.user.email.toLowerCase().trim(),
      uid: uuid(),
      credentials: { password: hashPassword(req.body.user.password) },
      profile,
      realms,
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

function sendEmail(helpers) {
  return function(req, res, next) {
    if (helpers.sendEmail) {
      /* generate token to active email */
      const user = req.user
      const token = jwt.sign(
        {uid: user.uid}, 
        process.env.EMAIL_SIGN_KEY
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
    const cookie = encodeCookie(req.user)
    res.cookie('session', cookie, { httpOnly: true })
    next()      
  }
}

function responseSuccess() {
  return function(req, res) {
    res.status(200).json({ user: serializeUser(req.user), token: req.authenToken })
  }
}

module.exports = [validateParameters, checkUserExistance, createUser, generateAuthenToken, sendEmail, setHttpCookie, responseSuccess]
