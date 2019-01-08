"use strict"

const Builder = require('express-api-builder')

const api = Builder()

/* resource: session */
api.add('/session',
  {
    get: require('./sso'),
    post: require('./new-session')
  }
)
api.add('/session/new',
  {
    get: require('./sign-in-form')
  }
)
api.add('/session/clean',
  {
    get: require('./clean-session')
  }
)

/* resource: users */
api.add('/users',
  {
    post: require('./new-user')
  }
)
api.add('/users/new',
  {
    get: require('./sign-up-form')
  }
)

module.exports = api
