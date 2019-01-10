"use strict"

import React, { Component } from 'react'

export default class Error extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="w3-container" style={{ padding: "10px 12px", maxWidth: "460px" }}>
        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
        </header>
        <div>
          <h4 className="w3-text-red"> {this.props.code} </h4>
          <p> {this.props.detail} </p>
        </div>
      </div>
    )
  }
}