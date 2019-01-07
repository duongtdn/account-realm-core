"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

console.log('Client script')

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div> 
        <h2> Hello </h2>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
