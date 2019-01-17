"use strict"

const cookieParser = require('cookie-parser')

const Builder = require('express-api-builder')

const api = Builder()

api.use(cookieParser())

/* resource: session */
api
.add('/session',
  {
    get: require('./sso'),
    post: require('./new-session')
  }
)
.add('/session/clean',
  {
    get: require('./clean-session')
  }
)

/* resource: users */
api
.add('/users',
  {
    post: require('./new-user'),
    get: require('./get-user')
  }
)

/* forms */
api.add('/form',
  {
    get: require('./form')
  }
)

module.exports = api
