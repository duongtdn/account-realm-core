"use strict"

import React, { Component } from 'react'
import { render } from "react-dom"

import MyAccount from '../templates/components/MyAccount'
import { UserProvider } from 'react-user'
import AccountClient  from "account-realm-client"

const acc = new AccountClient({
  realm: 'account',
  app: 'account',
  baseurl: 'http://localhost:3100'
})

document.addEventListener("DOMContentLoaded", function(event) {
  acc.sso()  
  render(
    <UserProvider accountClient = {acc}>
      <MyAccount onUserUpdated={updateUser} />
    </UserProvider>, 
    document.getElementById("root")
  )
})

function updateUser(updated) {
  const user = {...acc.get('user')}
  updated.forEach( ({key, data}) => {
    user[key] = data
  })    
  console.log(user)
  acc.updateLocalSession('user', user)
}