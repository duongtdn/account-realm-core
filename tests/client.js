"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import SignUp from '../src/clients/templates/components/SignUp'

console.log('Client script')

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        <SignUp urlBasePath = '/api' />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
