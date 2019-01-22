"use strict"

require('dotenv').config()

const path = require('path')
const express = require('express')
const api = require('../src/api/main')

const Realms = [
  {realmId: 'account', secret: 'realm-account-secret'},
  {realmId: 'realm', secret: 'realm-secret'}
]

const Apps = [
  {appId: 'account', url: 'http://localhost:3100'},
  {appId: 'dev', url: 'http://localhost:3300'}
]

const Users = [
  {
    uid: 'initiator',
    username: 'initiator@test.com',
    credentials: {
      password: '123'
    },
    profile: {
      email: ['breaker@test.com'],
      displayName: 'Initiator Tester',
      fullName: 'Initiator Tester'
    },
    verified: false
  }
]

api.helpers({
  Collections: {
    Realms: {
      find({realmId}, done) {
        setTimeout(() => {
          done && done(Realms.filter(_realm=> _realm.realmId === realmId))
        }, 500)
        return this
      }
    },
    Apps: {
      find({realm, app}, done) {
        setTimeout(() => {
          done && done(Apps.filter(_app => _app.appId === app))
        }, 500)
        return this
      }
    },
    Users: {
      find({username, uid}, done) {
        setTimeout(() => {
          done && done(Users.filter(_user => _user.username === username || _user.uid === uid))
        }, 500)
        return this
      },
      insert({user}, done) {
        setTimeout(() => {
          Users.push(user)
          done && done(user)
        }, 500)
        return this
      },
      update({uid}, update, done) {
        Users.forEach( _user => {
          if (_user.uid === uid) {
            for (let p in update) {
              _user[p] = update[p]
            }
          }
        })
        setTimeout(() => {
          done && done(null, update)
        },500)
      }
    }
  }
})

api.helpers({
  sendEmail({recipient, template, data}) {
    return new Promise((resolve, reject) => {
      console.log(`Sending email <${template}> ...`)
      console.log(`recipient: ${recipient[0].name}<${recipient[0].email}>`)
      if (template === 'verifyemail') {
        console.log('Link:')
        console.log(`http://localhost:3100/link/mailverify/${data.token}`)
      }            
      if (template === 'resetemail') {
        console.log('Link:')
        console.log(`http://localhost:3100/link/pwdreset/${data.token}`)
      }            
      console.log('Email sent successful')
      resolve()
    })
  }
})

const app = express()

app.use('/assets', express.static(path.join(__dirname, '../build/clients')))

app.use('/', api.generate())

app.listen(3100, function() {
  console.log('Server is running at 3100')
})