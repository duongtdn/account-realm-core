"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Signup from '../clients/templates/components/sign-up-form'

console.log('Client script')

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        <Signup />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
