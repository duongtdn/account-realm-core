"use strict"

import React from 'react'
import { render } from "react-dom"

import MyAccount from '../templates/components/MyAccount'

import AccountClient  from "account-realm-client"

const acc = new AccountClient({
  realm: 'account',
  app: 'account',
  baseurl: 'http://localhost:3100'
})

const user = {
  username : 'awesome@team.com',
  profile: {
    fullName: 'Awesome Tester',    
    email: ['awesome@team.com']
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  acc.sso((status, user) => {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user.profile.displayName}<${user.profile.email[0]}>`)
        break
      case 404:
        console.log('no sign-in user')
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  })
  render(<MyAccount urlBasePath = '/' user = {user} signUp={signUp} />, document.getElementById("root"))
})

function signUp() {
  acc.signup((status, user) => {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user.profile.displayName}<${user.profile.email[0]}>`)
        break
      case 404:
        console.log('no sign-in user')
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  })
}