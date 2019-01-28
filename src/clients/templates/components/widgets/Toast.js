"use strict"

import React, { Component } from 'react'

class Toast extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.close()
    }, 2000)
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
      anim = 'w3-animate-bottom'
    } else {
      style.top = 0
      anim = 'w3-animate-top'
    }
    return (
      <div className={`w3-panel w3-border w3-${this.props.color} ${anim}`} style={style}>
        <h3> <i className={`fa ${this.props.icon}`} /> {this.props.title} </h3>
        <p> {this.props.message} </p>
      </div>
    )
  }

}

export default Toast