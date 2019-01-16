"use strict"

require('dotenv').config()

const path = require('path')
const express = require('express')
const api = require('../src/api/main')

const Realms = [
  {realmId: 'realm', secret: 'realm-secret'}
]

const Apps = [
  {appId: 'dev', url: 'http://localhost:3200'}
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
      }
    }
  }
})

api.helpers({
  sendEmail({recipient, template, data}) {
    return new Promise((response, reject) => {
      console.log('Sending email...')
      reject()
    })
  }
})

const app = express()

app.use('/assets', express.static(path.join(__dirname, '../build/clients')))

app.use('/', api.generate())

app.listen(3100, function() {
  console.log('Server is running at 3100')
})