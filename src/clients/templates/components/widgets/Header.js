"use strict"

import React, { Component } from 'react'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const acc = this.props.accountClient
    return (
      <header className="w3-bar w3-blue">
        <div className="w3-right">
          <button className="w3-bar-item w3-button" onClick={evt => acc.signup()}> Sign up</button>
          <button className="w3-bar-item w3-button" onClick={evt => acc.signin()}> Sign in</button>
          <button className="w3-bar-item w3-button" onClick={evt => acc.signout()}> Sign out</button>
        </div>
      </header>
    )
  }
}

export default Header