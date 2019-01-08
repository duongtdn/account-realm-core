"use strict"

import React, { Component } from 'react'

import { xhttp, isEmail, scorePassword } from 'authenform-utils'

class Email extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: 'example@mail.com',
      error: '',
      syncing: false
    }
    this.getTypedEmail = this.getTypedEmail.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  render(props) {
    const borderColor = this.state.error.length === 0 ? '' : 'w3-border-red';
    return (
      <div >
        <p className="w3-text-blue-grey">
          Please enter your email to create a new account
        </p>
        <p>
          <label> Email </label>
          <label className="w3-right w3-text-red"> {this.state.error} </label> 
          <input className = {`w3-input w3-border ${borderColor}`}
                type = "text" 
                placeholder = "email@examaple.com"
                value = {this.state.email}
                onChange = {this.getTypedEmail}
                onKeyUp = {this.handleKeyUp} 
                disabled = {this.state.syncing} 
          />
        </p>
        <button type="submit" className={`w3-button w3-blue w3-right`} onClick={this.onConfirm} disabled = {this.state.syncing} > 
          Next {' '}
          {
            this.state.syncing? <i className ="fa fa-refresh fa-spin" /> : <i className ="fa fa-chevron-right" />
          } 
        </button>
      </div>
    )
  }

  getTypedEmail(evt) {
    const email = evt.target.value;
    const error = email.length === 1 ? '' : this.state.error; 
    this.setState ({ email, error });
  }

  handleKeyUp(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.onConfirm()
    }
  }

  onConfirm() {

    let error = '';
    const email = this.state.email;

    if (!isEmail(email)) {
      error = 'Invalid Email Address';
      if (email.length === 0) {
        error = 'Email is empty';
      }
    }

    if (error.length !== 0) {
      this.setState({ error })
      return
    }

    this.setState({ syncing: true})
    xhttp.get(`${this.props.urlBasePath}/users?u=${email}`, (status, response) => {
      const syncing = false
      if (status === 404 && response === 'email not found') {
        this.setState({ email, error, syncing})
        this.props.onConfirm && this.props.onConfirm(email)
        return
      } 
      if (status === 200) {
        error = 'This email has been used'
        this.setState({ error, syncing })
        return
      }
      this.props.onError && this.props.onError(status)
    })

  }
}

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  render(props) {
    const urlBasePath = this.props.urlBasePath || ''
    return (
      <div className="w3-container" style={{ padding: "24px 12px", maxWidth: "460px" }}>
        <header > 
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <h3 className="w3-text-blue" style={{fontWeight: "bold"}} > Create New Account </h3>
        </header>
        <Email  urlBasePath = {urlBasePath}
                onConfirm = {this.getEmail}
                onError = {this.onError}
        />
      </div>
    )
  }

  getEmail(email) {
    console.log(email)
  }

  onError(status) {
    console.log(status)
  }
}