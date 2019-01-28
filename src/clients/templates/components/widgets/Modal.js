"use strict"

import React, { Component } from 'react'

class Modal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const display = this.props.display ? 'block' : 'none'
    return (
      <div className="w3-modal" style={{ display }}>
        <div className="w3-modal-content" style={{background: 'none', textAlign: 'center', color: 'white'}} >
           <div className="w3-container">
              <i className={`fa w3-xxlarge ${this.props.icon}`} />
              <h2> {this.props.message} </h2>
            </div>
        </div>
      </div>
    )
  }
}

export default Modal