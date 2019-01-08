"use strict"

import React, { Component } from 'react'

class BackButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <button className = "w3-button w3-border" style = {{marginBottom: '16px'}}
                onClick = {this.props.onClick} >
          <i className = "fa fa-arrow-left" /> { this.props.title || 'Back' }
        </button>
      </div>
    )
  }

}

export default BackButton