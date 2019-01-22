"use strict"

import React, { Component } from 'react'

export default class PasswordBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '123',
      error: '',
      syncing: false
    }
    this.getTypedPassword = this.getTypedPassword.bind(this);
    this.handleKeyUpForPassword = this.handleKeyUpForPassword.bind(this);
    this.submit = this.submit.bind(this)
  }

  render() {
    const borderColor = this.state.error.length > 0 ? 'w3-border-red': ''
    return (
      <div >
        <div className = "" >          
          <p>
            <label className="w3-text-grey" >Password</label>
            <label className="w3-right w3-text-red"> {this.state.error} </label> 
            <input  className = {`w3-input w3-border ${borderColor}`}
                    type = "password" 
                    placeholder = "password"
                    value = {this.state.password}
                    onChange = {this.getTypedPassword}
                    onKeyUp = {this.handleKeyUpForPassword}
            />            
          </p>
        </div>
        <div style = {{marginBottom: '42px'}}>
          <div className="w3-cell-row">
            <div className="w3-cell">
            {/* <label className="w3-text-orange "><a href={`${this.props.urlBasePath}/form?name=requestresetpassword&realm=${__data.realm}&app=${__data.app}&email=${this.props.data.email}`}> Forgot your password </a></label> */}
            </div>
            <div className="w3-cell" style={{textAlign: 'right'}}>
              <button className = {`w3-button w3-blue`} 
                    onClick = {this.submit} disabled = {this.state.syncing} >
                Submit {' '} 
                {
                  this.state.syncing ?
                    <i className ="fa fa-circle-o-notch w3-spin" style = {{marginLeft: '4px'}} />
                  :
                  <i className ="fa fa-level-down fa-rotate-90" style = {{marginLeft: '4px'}} />
                }
              </button>          
            </div>
          </div>                    
        </div>        
      </div>
    )
  }

  getTypedPassword(evt) {
    const password = evt.target.value;
    const error = password.length === 0 ? 'Password must not empty' : '';
    this.setState({ password, error })
  }

  handleKeyUpForPassword(evt) {
    if (evt.which == 13 || evt.keyCode == 13) {
      this.submit()
    }
  }

  submit() {    
    const password = this.state.password
    if (this.state.error.length > 0) {
      return
    }
    this.setState({ syncing: true })
    this.props.onConfirm && this.props.onConfirm(password, (error) => {
      const syncing = false
      if (error) {
        this.setState({error, syncing})
      } else {
        this.setState({err: '', syncing})
      }
    })
  }
}
