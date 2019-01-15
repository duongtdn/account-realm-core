"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import SignUp from '../src/clients/templates/components/SignUp'
import SignIn from '../src/clients/templates/components/SignIn'

console.log('Client script')

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        <SignIn urlBasePath = '/api' close = {() => console.log('close')} />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
