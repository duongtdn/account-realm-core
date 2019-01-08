"use strict"

import React, { Component } from 'react'

class Email extends Component {
  constructor(props) {
    super(props)
  }
  render(props) {
    return (
      <div >
        <p className="w3-text-blue-grey">
          Please enter your email to create a new account
        </p>
        <p>
          <label> Email </label>
          <label className="w3-right w3-text-red"> This email has been used </label> 
          <input type="text" className="w3-input w3-border"  />
        </p>
        <button type="submit" className="w3-button w3-blue w3-right"> Next </button>
      </div>
    )
  }
}

export default class Signup extends Component {
  constructor(props) {
    super(props)
  }

  render(props) {
    return (
      <div className="w3-container" style={{ padding: "24px 12px", maxWidth: "460px" }}>
        <header > 
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <h3 className="w3-text-blue" style={{fontWeight: "bold"}} > Create New Account </h3>
        </header>
        <Email />
      </div>
    )
  }
}