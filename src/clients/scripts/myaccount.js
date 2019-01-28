"use strict"

import React, { Component } from 'react'
import { render } from "react-dom"

import MyAccount from '../templates/components/MyAccount'

import AccountClient  from "account-realm-client"

const acc = new AccountClient({
  realm: 'account',
  app: 'account',
  baseurl: 'http://localhost:3100'
})

class UserProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
    this.signOut = this.signOut.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentWillMount() {
    acc.sso((status, user) => {
      switch (status) {
        case 200:
          console.log(`sign-in user: ${user.profile.displayName}<${user.profile.email[0]}>`)
          this.setState({ user })
          break
        case 404:
          console.log('no sign-in user')
          this.setState({ user: undefined })
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

  render() {
    return (
      <MyAccount  user = {this.state.user} 
                  signUp={this.signUp} 
                  signIn={this.signIn} 
                  signOut={this.signOut} 
                  onUserUpdated={this.updateUser} 
      />
    )
  }

  signUp() {
    acc.signup((status, user) => {
      switch (status) {
        case 200:
          console.log(`sign-in user: ${user.profile.displayName}<${user.profile.email[0]}>`)
          this.setState({ user })
          break
        case 404:
          console.log('no sign-in user')
          this.setState({ user: undefined })
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

  signIn() {
    acc.signin((status, user) => {
      switch (status) {
        case 200:
          console.log(`sign-in user: ${user.profile.displayName}<${user.profile.email[0]}>`)
          this.setState({ user })
          break
        case 404:
          console.log('no sign-in user')
          this.setState({ user: undefined })
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

  signOut() {
    acc.signout((status, user) => {
      switch (status) {
        case 200:
          console.log(`user has signed out`)
          this.setState({ user: undefined })
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

  updateUser(updated) {
    const user = {...this.state.user}
    updated.forEach( ({key, data}) => {
      user[key] = data
    })    
    this.setState( { user })
    /* TBD: update localStorage */
  }
}

document.addEventListener("DOMContentLoaded", function(event) {  
  render(<UserProvider />, document.getElementById("root"))
})