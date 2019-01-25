"use strict"

import React, { Component } from 'react'
import { xhttp, storage } from 'authenform-utils'

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
    this.state = { error: {} }
    this.originProfile = {
      fullName: '',
      displayName: '',
      gender: '',
      email:[''],
      address: '',
      phone: [''],
      birthday: '',
      picture: ''
    }
    this.updateProfile = this.updateProfile.bind(this)
    this.resetState = this.resetState.bind(this)
  }
  componentWillMount() {
    this._updateStateFromProps(this.props.user.profile)
  } 
  componentWillReceiveProps(props) {
    this._updateStateFromProps(props.user.profile)
  }
  render() {
    return(
      <div className = "">
        <h4> Profile </h4> 
        {/* Full Name */}
        <p > 
          <span >
            <label>Full Name</label>
            <label className="w3-right w3-text-red"> {this.state.error.fullName} </label> 
            <input className={`w3-input w3-border ${this.state.error.fullName? 'w3-border-red': ''}`}
                    type="text"
                    value={this.state.fullName}
                    onChange={this.getTyped('fullName')}
            />
          </span>          
        </p>
        {/* Display Name */}
        <p>
          <span className="w3-mobile" style={{width: '100%', display: 'inline-block'}}>
            <label>Display Name</label>
            <label className="w3-right w3-text-red"> {this.state.error.displayName} </label>
            <input  className={`w3-input w3-border ${this.state.error.displayName? 'w3-border-red': ''}`}
                    type="text"
                    value={this.state.displayName}
                    onChange = {this.getTyped('displayName')}
            />
          </span>
        </p>
        {/* Gender */}
        <p>
          <label style={{marginRight: '4px'}}> Gender: </label>

          <input className="w3-radio" style={{marginRight: '4px'}} type="radio" name="gender" value="male" 
                 checked={this.state.gender === 'male'} 
                 onChange = { () => this.setState({gender: 'male'}) }
          />
          <label>Male</label>

          <label style={{marginRight: '8px'}} />

          <input className="w3-radio" style={{marginRight: '4px'}} type="radio" name="gender" value="female" 
                 checked={this.state.gender === 'female'}
                 onChange = { () => this.setState({gender: 'female'}) }
          />
          <label>Female</label>
        </p>
        {/* Birthday */}
        <p>
          <span className="w3-mobile" style={{width: '35%', display: 'inline-block'}}>
            <label>Birthday</label>
            <input  className="w3-input w3-border"
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={this.state.birthday}
                    onChange = {this.getTyped('birthday')}
            />
          </span>
        </p>
        {/* Emails */}
        <p>
          <label>Email</label>
          <label className="w3-right w3-text-red"> {this.state.error.email} </label>
          {
            this.state.email.map((email, index) => {
              return (
                <span  key = {index} style={{display: 'block', marginBottom: '4px'}}>
                  <input  className = {`w3-input w3-border ${this.state.error.email? 'w3-border-red': ''}`}
                          type = "text"
                          value = {email}
                          disabled = {index === 0}
                          onChange = {this.getTyped('email', index)}
                  />
                  <label  className = "w3-text-blue" 
                          style = {{cursor: 'pointer', display: (index === this.state.email.length - 1) ? 'inline' : 'none'}} 
                          onClick = {this.addMoreBox('email')} > 
                    + Add more email 
                  </label>
                </span>
              )

            })
          }
        </p>
        {/* Phones */}
        <p>
          <label>Phone</label>
          <label className="w3-right w3-text-red"> {this.state.error.phone} </label>
          {
            this.state.phone.map((phone, index) => {
              return (
                <span  key = {index} style={{display: 'block', marginBottom: '4px'}}>
                  <input  className = {`w3-input w3-border ${this.state.error.phone? 'w3-border-red': ''}`}
                          type = "text"
                          value = {phone}
                          onChange = {this.getTyped('phone', index)}
                  />
                  <label  className = "w3-text-blue" 
                          style = {{cursor: 'pointer', display: (index === this.state.phone.length - 1) ? 'inline' : 'none'}} 
                          onClick = {this.addMoreBox('phone')} > 
                    + Add more phone number 
                  </label>
                </span>
              )

            })
          }
        </p>
        {/* Address */}
        <p>
          <label>Address</label>
          <input  className="w3-input w3-border"
                  type="text"
                  value={this.state.address}
                  onChange = {this.getTyped('address')}
          />
        </p>

        <hr />

        <p>
          <button className="w3-button w3-blue w3-hover-blue w3-hover-opacity" onClick={this.updateProfile} disabled={this._isStateMatchOrigin()} > Save </button>
          <label style={{marginRight: '8px'}} />
          <button className="w3-button" onClick={this.resetState} disabled={this._isStateMatchOrigin()} > Reset </button>
        </p>
      </div>
    )
  }
  getTyped(target, index) {
    if (index !== undefined) {
      return (evt) => {
        const state = {}
        state[target] = [...this.state[target]]
        state[target][index] = evt.target.value
        this.setState(state)
      }
    } else {
      return (evt) => {
        const state = {}
        state[target] = evt.target.value
        this.setState(state)
      }
    }    
  }
  addMoreBox(box) {
    return (evt) => {
      const _state = {}
      const _container = [...this.state[box]]
      _container.push('');
      _state[box] = _container;
      this.setState({ ..._state })
    }
  }
  updateProfile() {
    const error = {}
    const profile = {}
    for (let key in this.originProfile) {
      profile[key] = this.state[key]
    }
    profile.phone = this.state.phone.filter(phone => phone.length > 0)
    profile.email = this.state.email.filter(email => email.length > 0)
    /* validate user input */
    if (profile.birthday.length === 0) {
      profile.birthday = 'N/A'
    }
    if (profile.fullName.length === 0) {
      error.fullName = 'Please provide your name'
    }
    if (profile.displayName.length === 0) {
      error.displayName = 'Please provide a display name'
    }
    // if (profile.phone.length === 0) {
    //   error.phone = 'Please provide at least one number'
    // }
    if (profile.email.length === 0) {
      error.email = 'Please provide at least one email'
    }
    if (Object.keys(error).length > 0) {
      this.setState({error})
      return
    }
    this.setState({ syncing: true })
    xhttp.put(`${this.props.urlBasePath}/me/profile`, { profile, token: storage.get('token') },  (status, response) => {
      this.setState({ syncing: false })
      if (status === 200) {
        this.props.onSuccess && this.props.onSuccess(profile)
      } else {
        const error = `Error: ${status}`
        this.props.onError && this.props.onError(error)
      }
    })
  }
  resetState() {
    this._updateStateFromProps(this.props.user.profile)
  }
  _updateStateFromProps(profile) {   
    this._getOriginProfile(profile).setState({...this.state, ...this.originProfile})
  }
  _getOriginProfile(profile) {
    for (let key in this.originProfile) {
      if (profile[key]) {
        this.originProfile[key] = profile[key] === 'N/A' ? '' : profile[key]
      }
    }
    return this
  }
  _isStateMatchOrigin() {
    return Object.keys(this.originProfile).every( key => this.state[key] === this.originProfile[key])
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
      user: this.props.user,
      onSuccess: this.props.onSuccess,
      onError: this.props.onError
    })
  }  
}

export default class MyAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'profile'
    }
    this.tabs = [
      { icon: 'fa-key', name: 'password', label: 'change password' }, 
      { icon: 'fa-address-card-o', name: 'profile', label: 'profile' }
    ]
  }
  render() {
    return (
      <div>
        <header className="w3-bar w3-blue">
          <div className="w3-right">
            <button className="w3-bar-item w3-button" onClick={this.props.signUp}> Sign up</button>
            <button id="signin" className="w3-bar-item w3-button"> Sign in</button>
            <button id="signout" className="w3-bar-item w3-button"> Sign out</button>
          </div>
        </header>
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
                onSuccess = { data => console.log(data) }
                onError = { err => console.log(err) }
          />
        </div>
      </div>
    )
  }
}