"use strict"

import React, { Component } from 'react'
import { xhttp } from 'authenform-utils'

import NewPasswordBox from './widgets/NewPasswordBox'

class Error extends Component {
  constructor(props) {
    super(props)  
  }
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div style = {{ display }} >
        <div style = {{maxWidth: '460px', margin: 'auto'}}>
          <header>
            <h3 className = "w3-text-red">               
              <label> Error </label>
            </h3>
          </header>
          <hr />
          <div>
            <p> {this.props.error} </p>
          </div>
        </div>
      </div>
    )
  }
}

class Success extends Component {
  constructor(props) {
    super(props)  
  }
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div style = {{ display }} >
        <div style = {{maxWidth: '460px', margin: 'auto'}}>
          <header>
            <h3 className = "w3-text-green">               
              <label> Password Updated </label>
            </h3>
          </header>
          <hr />
          <div>
            <p> Your password has been updated </p>
          </div>
        </div>
      </div>
    )
  }
}

class Password extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div style = {{ display }}>
        <div style = {{maxWidth: '460px', margin: 'auto'}}>
          <header>
            <h3 className = "w3-text-blue">               
              <i className="fa fa-key"></i>
              <label> New Password </label>
            </h3>
          </header>
          <hr />
          <NewPasswordBox   onConfirm = {this.props.onConfirm}
                            btnLabel = 'Submit new password'           
                            icon = ''
                            syncing = {this.props.syncing}
          />
        </div>        
      </div>
    )
  }
}

export default class NewPasswordForm extends Component {
  constructor(props) {
    super(props)  
    this.state = {
      syncing: false,
      flow: 'password',
      error: ''
    }  
    this.onSubmit = this.onSubmit.bind(this)
  }
  render() {
    return (
      <div className = "w3-container" style = {{ marginTop: '48px' }}>
        <Password display = {this.display('password')}
                  onConfirm = {this.onSubmit}                          
                  syncing = {this.state.syncing}
        />   
        <Error  display = {this.display('error')}
                error = {this.state.error}
        />   
        <Success  display = {this.display('success')}                
        /> 
      </div>
    )
  }
  onSubmit({password}) {
    const token = __data.token
    this.setState({ syncing : true })
    xhttp.post(`${this.props.urlBasePath}/users/password`, { token, password }, (status, response) => {
      const syncing = false
      if (status === 200) {
        this.setState({ error: '', syncing, flow: 'success' })        
        return
      } 
      if (status !== 200) {
        const error = `An error occur during submitting. Error: ${status}`
        this.setState({ error, syncing, flow: 'error' })
        return
      }
    })
  }
  display(flow) {
    return this.state.flow === flow;
  }
}