"use strict"

import React, { Component } from 'react'
import { xhttp } from 'authenform-utils'

import NewPasswordBox from './widgets/NewPasswordBox'

function _titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}

class TabPassword extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className = "">
        <h4> Change password </h4>
      </div>
    )
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
            <button key = {tab} className={`w3-bar-item w3-button w3-border-bottom ${this.isActive(tab)? 'w3-blue': ''}`} 
                 onClick={() => this.props.onSelectTab(tab)} 
            >
              { _titleCase(tab) }
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
            <button key={tab}  className={`w3-bar-item w3-button w3-border-bottom`} onClick={() => this.props.onSelectTab(tab)}>
              { _titleCase(tab) }
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
      tab: 'profile'
    }
    this.tabs = ['password', 'profile']
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