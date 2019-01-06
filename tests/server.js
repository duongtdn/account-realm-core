"use strict"

const express = require('express')
const api = require('../api/main')

const app = express()
app.use('/', api.generate())

app.listen(3100, function() {
  console.log('Server is running at 3100')
})