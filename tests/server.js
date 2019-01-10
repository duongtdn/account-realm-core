"use strict"

require('dotenv').config()

const path = require('path')
const express = require('express')
const api = require('../src/api/main')

const Apps = [
  {appId: 'dev', url: 'http://localhost:3200'}
]

api.helpers({
  Collections: {
    Apps: {
      find({realm, app}, done) {
        setTimeout(() => {
          done && done(Apps.filter(_app => _app.appId === app))
        }, 500)
        return this
      }
    }
  }
})

const app = express()

app.use('/assets', express.static(path.join(__dirname, '../build/clients')))

app.use('/', api.generate())

app.listen(3100, function() {
  console.log('Server is running at 3100')
})