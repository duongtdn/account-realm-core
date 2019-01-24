"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import SignUp from '../src/clients/templates/components/SignUp'
import SignIn from '../src/clients/templates/components/SignIn'
import MyAccount from '../src/clients/templates/components/MyAccount'

console.log('Client script')
const user = {
  username : 'awesome@team.com',
  profile: {
    fullName: 'Awesome Tester',    
    email: ['awesome@team.com']
  }
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        {/* <SignIn urlBasePath = '/api' close = {() => console.log('close')} /> */}
        <MyAccount urlBasePath = '/api' user = {user} />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
