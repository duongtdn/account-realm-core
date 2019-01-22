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
  }
  render() {
    return (
      <div className = ""> 
        <div>
          <div style={{ display: this.display('password') }} >
            <p className="w3-text-blue"> Submit your password to unlock </p>
            <PasswordBox  onConfirm = {this.validateAuthentication}
            />
          </div>
          <hr />
          <div style={{ display: this.display('newPassword') }} >
            <h4> Change Password </h4>
            <NewPasswordBox   onConfirm = { pwd => console.log(pwd)}
                              btnLabel = 'Submit new password'           
                              icon = ''
            />
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
        this.setState({ display: 'newPassword' })
        return
      } 
      if (status === 401) {
        const error = `Invalid password`
        done && done(error)
        return
      }
      if (status !== 200) {
        const error = `An error occur during singing in. Error: ${status}`
        done && done(error)
        return
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
        <h3 className="w3-bar-item">Menu</h3>
        {
          this.props.tabs.map( tab => (            
            <button key = {tab.label} className={`w3-bar-item w3-button w3-border-bottom ${this.isActive(tab.label)? 'w3-blue': ''}`} 
                 onClick={() => this.props.onSelectTab(tab.label)} 
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
      <div className="w3-dropdown-hover" style={{background:'none'}}>
        <h3> {this.props.activeTab.toUpperCase()} <i className="fa fa-caret-down w3-hide-medium w3-hide-large" /> </h3>
        <div className="w3-dropdown-content w3-bar-block w3-card-4 w3-hide-medium w3-hide-large" style={{backgroundColor: '#f1f1f1'}}>
        {
          this.props.tabs.map(tab => (
            <button key={tab.label}  className={`w3-bar-item w3-button w3-border-bottom`} onClick={() => this.props.onSelectTab(tab.label)}>
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
      { icon: 'fa-key', label: 'password' }, 
      { icon: 'fa-address-card-o', label: 'profile' }
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