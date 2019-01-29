"use strict"

import React, { Component } from 'react'

class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = { opening: false, closing: false }
    this._animateClosing = this._animateClosing.bind(this)
  }

  componentWillReceiveProps(props) {
    if (!this.props.display && props.display) {
      this._animateOpening()
          .then(this._waitFor2second)
          .then(this._animateClosing)
          .then(this.props.close)
    }    
  }

  render() {
    const display = this.props.display ? 'block' : 'none'    
    let   anim = ''
    const style = { 
      display,
      position: 'fixed',
      left: 0,
      width: '100%',
      zIndex: 1,
      margin: 0
    }
    if (this.props.bottom) {
      style.bottom = 0      
    } else {
      style.top = 0
    }
    if (this.state.opening || this.state.closing) {
      anim = this.props.bottom? 'w3-animate-bottom' : 'w3-animate-top'      
    }    
    if (this.state.closing) {
      style.animationDirection = 'reverse'
    }
    return (
      <div className={`w3-panel w3-border w3-${this.props.color} ${anim}`} style={style}>
        <h3> <i className={`fa ${this.props.icon}`} /> {this.props.title} </h3>
        <p> {this.props.message} </p>
      </div>
    )
  }

  _animateOpening() {
    this.setState({ opening: true })
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setState({ opening: false })               
        resolve()
      }, 500)      
    })
  }

  _waitFor2second() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  _animateClosing() {    
    this.setState({ closing: true })
    return new Promise((resolve) => {
      setTimeout(() => {    
        this.setState({ closing: false })    
        resolve()        
      }, 200)
    })
  }

}

export default Toast