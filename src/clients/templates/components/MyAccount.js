"use strict"

import React, { Component } from 'react'
import { xhttp } from 'authenform-utils'

import PasswordBox from './widgets/PasswordBox'
import NewPasswordBox from './widgets/NewPasswordBox'

function _titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

class TabPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      newPassword: '',
      display: 'password'
    }
    this.validateAuthentication = this.validateAuthentication.bind(this)
    this.submitNewPassword = this.submitNewPassword.bind(this)
  }
  render() {
    return (
      <div className = ""> 
        <div>
          <div style={{ display: this.display('password') }} >
            <p className="w3-text-blue"> Submit your password to unlock feature</p>
            <PasswordBox  onConfirm = {this.validateAuthentication}
                          realm = 'account'
                          app = 'account'
                          email = {this.props.user.profile.email[0]}
                          urlBasePath = {this.props.urlBasePath}
            />
          </div>
          <hr />
          <div style={{ display: this.display('newPassword') }} >
            <h4> Change Password </h4>
            <NewPasswordBox   onConfirm = {this.submitNewPassword}
                              btnLabel = 'Submit new password'           
                              icon = ''
            />
          </div>
          <div style={{ display: this.display('success') }} >
            <h4> Change Password </h4>
            <p className = 'w3-text-green'> Password updated! </p>
          </div>
        </div>    
      </div>
    )
  }
  validateAuthentication(password, done) {
    const username = this.props.user.username
    xhttp.post(`${this.props.urlBasePath}/session`, { username, password, realm: 'account' },  (status, response) => {
      if (status === 200) {
        done && done(null)
        this.setState({ password, display: 'newPassword' })
        return
      } 
      if (status === 401) {
        const error = `Invalid password`
        done && done(error)
        return
      }
      if (status !== 200) {
        const error = `Error: ${status}`
        done && done(error)
        return
      }
    })    
  }
  submitNewPassword(password, done) {
    const username = this.props.user.username
    xhttp.put(`${this.props.urlBasePath}/users/password`, { username, password: this.state.password, newPassword: password },  (status, response) => {
      if (status === 200) {
        done && done(null)
        this.setState({ display: 'success' })
      } else {
        const error = `Error: ${status}`
        done && done(error)
      }
    })
  }
  display(state) {
    return this.state.display === state ? 'block' : 'none'
  }
}

class TabProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className = "">
        <h4> Profile </h4> 
      </div>
    )
  }
}


/* Add Components into tabs to be able to displayed in <SideBar /> and <Tabs /> */

const tabs = {
  TabPassword,
  TabProfile
}


/* SideBar and Tabs */

class SideBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="w3-sidebar w3-bar-block w3-border-right w3-hide-small" style={{background: 'none', width: '200px'}}>
        <h4 className="w3-bar-item">Menu</h4>
        {
          this.props.tabs.map( tab => (            
            <button key = {tab.name} className={`w3-bar-item w3-button  ${this.isActive(tab.name)? 'w3-blue': ''}`} 
                 onClick={() => this.props.onSelectTab(tab.name)} 
            >
              <i className={`fa ${tab.icon}`}></i> { _titleCase(tab.label) }
            </button> 
          ))
        }  
      </div>
    )
  }
  isActive(tab) {
    return this.props.activeTab === tab
  }
}

class Tabs extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="w3-row">
        <div className="w3-col  w3-hide-small" style={{width: '200px', height: '10px'}} /> 
        <div className="w3-rest w3-container">
          { this.renderDropdown() }
          { this.renderTab(this.props.activeTab) }
        </div>
      </div>
    )
  }
  renderDropdown() {
    return (
      <div className="w3-dropdown-hover" style={{background:'none', width: '100%'}}>
        <h4 style={{marginTop: '16px'}}> {this.props.activeTab.toUpperCase()} <i className="fa fa-caret-down w3-hide-medium w3-hide-large" /> </h4>
        <div className="w3-dropdown-content w3-bar-block w3-card-4 w3-hide-medium w3-hide-large" style={{backgroundColor: '#f1f1f1'}}>
        {
          this.props.tabs.map(tab => (
            <button key={tab.name}  className={`w3-bar-item w3-button w3-border-bottom`} onClick={() => this.props.onSelectTab(tab.name)}>
              <i className={`fa ${tab.icon}`}></i> { _titleCase(tab.label) }
            </button>
          ))
        }
        </div>
      </div>
    )
  }
  renderTab(tab) {
    return React.createElement(tabs[`Tab${_titleCase(tab)}`], {
      urlBasePath : this.props.urlBasePath,
      user: this.props.user
    })
  }  
}

export default class MyAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'password'
    }
    this.tabs = [
      { icon: 'fa-key', name: 'password', label: 'change password' }, 
      { icon: 'fa-address-card-o', name: 'profile', label: 'profile' }
    ]
  }
  render() {
    return (
      <div className = "w3-container">
        <SideBar  tabs = {this.tabs}
                  activeTab = {this.state.tab}
                  onSelectTab = { (tab) => this.setState({ tab }) }
        />
        <Tabs tabs = {this.tabs}
              activeTab = {this.state.tab}
              onSelectTab = { (tab) => this.setState({ tab }) }
              user = { this.props.user }
              urlBasePath = { this.props.urlBasePath }
        />
      </div>
    )
  }
}