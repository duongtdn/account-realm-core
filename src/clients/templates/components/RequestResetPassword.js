"use strict"

import React, { Component } from 'react'

export default class RequestRestPassword extends Component {
  constructor(props) {
    super(props)    
  }
  render() {
    return (
      <form className = "w3-container" method="post" action = "/outbox">
        <input type = "hidden" value = {this.props.email} name = "email" />
        <input type = "hidden" value = 'resetemail' name = "template" />
        <input type = "hidden" value = {__data.realm} name ='realm'  />
        <input type = "hidden" value = {__data.app} name = 'app' />
        <h3 className = "w3-text-blue"> You are requesting to reset password </h3> 
        <p> An email containing link to reset your password will be sent to <span className="w3-text-blue" style={{fontWeight: 'bold'}}> {this.props.email} </span> </p>
        <p> Click the button below to confirm your request </p>
        <button type = "submit" className = "w3-button w3-blue" > Submit Request <i className = "fa fa-paper-plane" /> </button>
        {' '}
        <button type = "button" className = "w3-button" onClick={this.props.close} style={{ display: (window.self === window.top)? 'none': 'inline'}} > Cancel </button>
      </form>
    )
  }
}