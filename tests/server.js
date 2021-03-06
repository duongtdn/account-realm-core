"use strict"

require('dotenv').config()

const args = process.argv.slice(2)

const path = require('path')
const express = require('express')
const api = require('../src/api/main')


const Realms = process.env.REALM.split(' ').map( item => {
  const s = item.split('|')
  return { realmId: s[0], secret: s[1] }
})

const Apps = process.env.APP.split(' ').map( item => {
  const s = item.split('|')
  return { appId: s[0], url: s[1] }
})

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
  },
  {
    username: 'awesome@team.com',
    uid: '4fc9d440-8f7a-11e9-95d5-315e185d3a06',
    credentials: {
      password: 'd3c9b2b2cf82bb549720d5b079fcd6fa9668fbc8ab76383f097f3fee01a062de'
    },
    profile: {
      email: [ 'awesome@team.com' ],
      fullName: 'Awesome Tester',
      displayName: 'Tester',
      gender: 'N/A',
      phone: [],
      address: 'N/A',
      picture: undefined
    },
    realms: { account: true, realm: true },
    verified: false,
    createdAt: 1560609109893
  }
]
const userdbDriver = {
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

api.helpers({
  Collections: {
    Realms: {
      find({realmId}, done) {
        done && done(Realms.filter(_realm=> _realm.realmId === realmId))
        return this
      }
    },
    Apps: {
      find({realm, app}, done) {
        done && done(Apps.filter(_app => _app.appId === app))
        return this
      }
    },
    Users: args[0] === 'local' ? userdbDriver : require('account-dynamodb-driver')
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