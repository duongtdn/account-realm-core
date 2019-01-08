"use strict"

const Builder = require('express-api-builder')

const api = Builder()

/* resource: session */
api
.add('/session',
  {
    get: require('./sso'),
    post: require('./new-session')
  }
)
.add('/session/new',
  {
    get: require('./sign-in-form')
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
.add('/users/new',
  {
    get: require('./sign-up-form')
  }
)

module.exports = api
