"use strict"

import React, { Component } from 'react'

import NewPasswordBox from './widgets/NewPasswordBox'

export default class NewPasswordForm extends Component {
  constructor(props) {
    super(props)  
    this.state = {
      messageBox1 : '',
      messageBox2 : '',
      password: '',
      score: 0,
      retypePassword: ''
    }  
  }
  render() {
    return (
      <div className = "w3-container" style = {{marginTop: '48px'}}>
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
          />
        </div>        
      </div>
    )
  }

}