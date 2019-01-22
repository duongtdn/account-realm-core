"use strict"

import React, { Component } from 'react'
import { xhttp } from 'authenform-utils'

import NewPasswordBox from './widgets/NewPasswordBox'

function _titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

class PasswordBox extends Component {
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
    setTimeout(() => {
      console.log(password)
      done(null)
      this.setState({ password, display: 'newPassword' })
    },1000)
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
    return React.createElement(tabs[`Tab${_titleCase(tab)}`])
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
        />
      </div>
    )
  }
}