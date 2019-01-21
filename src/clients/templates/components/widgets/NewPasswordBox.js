"use strict"

import React, { Component } from 'react'
import { scorePassword } from 'authenform-utils'

import Message from './Message'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'

export default class NewPasswordBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageBox1 : '',
      messageBox2 : '',
      password: '123',
      score: 0,
      retypePassword: '123'
    }

    this.onConfirm = this.onConfirm.bind(this);
    this.getTypedPassword = this.getTypedPassword.bind(this);
    this.getReTypePassword = this.getReTypePassword.bind(this);
    this.handleKeyUpForPassword = this.handleKeyUpForPassword.bind(this);
    this.handleKeyUpForRetypePassword = this.handleKeyUpForRetypePassword.bind(this)
    this._renderPasswordBox = this._renderPasswordBox.bind(this);
    this._renderConfirmButton = this._renderConfirmButton.bind(this);

  }

  render() {
    return (
      <div >

        <div className ="w3-text-blue" >
          Create your new secret password.
        </div>
        <div className ="w3-text-grey" >
          Your password should contain lower case, upper case, 
          at least one number and special characters.
        </div>

        <hr />

        {this._renderPasswordBox()}

        {this._renderConfirmButton()}

  
      </div>
    )
  }

  getTypedPassword(evt) {
    const password = evt.target.value;
    const messageBox1 = password.length === 0 ? 'Password must not empty' : '';
    this.setState({ password, messageBox1 })
  }

  handleKeyUpForPassword(evt) {
    /* score password */
    const score = scorePassword(evt.target.value);
    this.setState({ score })
  }

  onConfirm() {
    const password = this.state.password;
    const retypePassword = this.state.retypePassword;
    /* validate password empty */
    if (password.length === 0) {
      this.setState({ messageBox1 : 'Password must not empty' });
      return
    }
    /* validate password match */
    if (password === retypePassword) {
      this.props.onConfirm && this.props.onConfirm({password});
    }
    else {
      this.setState({ messageBox2 : 'Password mismatch' })
    }
    
  }

  getReTypePassword(evt) {
    const retypePassword = evt.target.value;
    const messageBox2 = retypePassword.length === 0 ? '' : this.state.messageBox2;
    this.setState({ retypePassword, messageBox2 })
  }

  handleKeyUpForRetypePassword(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.onConfirm();
    }
  }

  _renderPasswordBox() {
    const borderColor1 = this.state.messageBox1.length > 0 ? 'w3-border-red': ''
    const borderColor2 = this.state.messageBox2.length > 0 ? 'w3-border-red': ''
    return (
      <div>

        {/* password */}
        <div>
          <div className = "w3-text-grey" style = {{marginBottom: '8px'}} > 
            Password
            <PasswordStrengthIndicator score = {this.state.score} />
          </div>
          <input  className = {`w3-input w3-border ${borderColor1}`}
                  type = "password" 
                  placeholder = "password"
                  value = {this.state.password}
                  onChange = {this.getTypedPassword}
                  onKeyUp = {this.handleKeyUpForPassword}
          />
          <Message message = {this.state.messageBox1} />

        </div>

        {/* retype password */}
        <div>
          <div className = "w3-text-grey" style = {{marginBottom: '8px'}} > 
            Retype Password
          </div>
          <input  className = {`w3-input w3-border ${borderColor2}`}
                  type = "password" 
                  placeholder = "retype your password"
                  value = {this.state.retypePassword}
                  onChange = {this.getReTypePassword}
                  onKeyUp = {this.handleKeyUpForRetypePassword} 
          />
          <Message message = {this.state.messageBox2} />
        </div>

      </div>
    )
  }

  _renderConfirmButton() {
    return (
      <div style = {{marginBottom: '42px', textAlign: 'right'}}>
        <button className = {`w3-button w3-blue`} 
                onClick = {this.onConfirm} >
                {this.props.btnLabel} <i className = {this.props.icon} /> 
        </button>
      </div>
    )
  }
}