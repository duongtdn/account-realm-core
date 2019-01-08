"use strict"

import React, { Component } from 'react'

export default class Message extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className = "w3-text-red" style = {{height: '26px', marginBottom: '8px'}} >
        {this.props.message}
      </div>
    )
  }
}