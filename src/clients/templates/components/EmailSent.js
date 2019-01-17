"use strict"

import React, { Component } from 'react'

export default class EmailSent extends Component {
  constructor(props) {
    super(props)    
  }
  render() {
    return (
      <div className = "w3-container" >
        <h3> { __data.title } </h3>
        <p> { __data.message1 } </p>
        <p> { __data.message2} </p>
        {
          this.props.showCloseButton ?
            <button className = "w3-button w3-blue" onClick = {this.props.close} > Close </button>
          : null
        }        
      </div>
    )
  }
}