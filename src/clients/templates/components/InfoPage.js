"use strict"

import React, { Component } from 'react'

export default class InfoPage extends Component {
  constructor(props) {
    super(props)  
  }
  render() {
    return (
      <div className = "w3-container" style = {{ marginTop: '16px' }}>
        <h3 className = "w3-text-blue"> {this.props.title} </h3>
        {
          this.props.messages.map( (message, index) => {
            return (
              <p key = {index} > {message} </p>
            )
          })
        }
      </div>
    )
  }
}
