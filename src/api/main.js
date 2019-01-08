"use strict"

const Builder = require('express-api-builder')

const api = Builder()

/* resource: session */
api.add('/session',
  {
    get: require('./session/sso'),
    post: require('./session/new-session')
  }
)
api.add('/session/new',
  {
    get: require('./session/sign-in-form')
  }
)
api.add('/session/clean',
  {
    get: require('./session/clean-session')
  }
)

/* resource: users */
api.add('/users',
  {
    post: require('./users/new-user')
  }
)
api.add('/users/new',
  {
    get: require('./users/sign-up-form')
  }
)

module.exports = api
