# account-realm-core

## Install

`npm install account-realm-core`

## Build client scripts

`npm run build`

Store built scripts in a CDN network

## Create a server using account-realm-core apis

Example below demonstrates how to use

```javascript
"use strict"

const api = require('account-realm-core')

// replace database-drivers with actual drivers
api.helpers({ Collections: require('database-drivers') })

// replace sendEmail with the actual implementation
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

app.use('/', api.generate())

app.listen(3100, function() {
  console.log('Server is running at 3100')
})

```
## Setup enviroment

The following `environment parameter` must be configured

```
CDN=url-of-cdn-store-client-scripts

PWD_PREFIX=prefix-add-to-user-password

PWD_SUFFIX=suffix-add-to-user-password

EMAIL_SIGN_KEY=email-sign-key

COOKIE_AUTHEN_KEY=cookie-authen-key

```
