"use strict"

function validateParameters() {
  return function(req, res, next) {
    if (!(req.body && req.body.token && req.body.profile)) {
      res.status(400).send('bad request')    
    } else {
      next()
    }
  }
}

function decodeToken() {
  return function(req, res, next) {
    const token = req.body.token
    helpers.Collections.Realms.find({ realmId: 'account' }, (realms) => {
      if (!(realms && realms[0])) {
        res.status(500).send('missing realm')
        return
      }
      jwt.verify(token, realm[0].secret, (err, decoded) => {
        if (err) {
          res.status(403).send('forbidden')  
        } else {
          req.uid = decoded.uid
          next()
        }
      })
    })
  }
}

function updateProfile(helpers) {
  return function(req, res) {
    const profile = req.body.profile
    helpers.Collections.Users.update({ uid }, { profile }, (err, updated) => {
      if (err) {
        res.status(500).send('DB access failed')
      } else {
        res.status(200).json({ profile })
      }
    })
    res.status(200).json({ profile: req.body.profile })
  }  
}

module.exports = [validateParameters, decodeToken, updateProfile]