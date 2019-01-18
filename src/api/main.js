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

/* outbox */
api.add('/outbox',
  {
    post: require('./new-email')
  }
)

/* link */
api.add('/link/pwdreset/:token', 
  {
    get: require('./link-pwdreset')
  }
)
module.exports = api