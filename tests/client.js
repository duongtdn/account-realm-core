"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Signup from '../src/clients/templates/components/sign-up-form'

console.log('Client script')

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        <Signup urlBasePath = '/api' />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
