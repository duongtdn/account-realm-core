"use strict"

import React, { Component } from 'react'

import { xhttp, isEmail, scorePassword } from 'authenform-utils'

import BackButton from './widgets/BackButton'
import Message from './widgets/Message'

class Email extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: 'example@mail.com',
      error: '',
      syncing: false
    }
    this.getTypedEmail = this.getTypedEmail.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  render(props) {
    const display = this.props.display ? 'block' : 'none';
    const borderColor = this.state.error.length === 0 ? '' : 'w3-border-red';
    return (
      <div style={{ display }}>
        <header > 
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <h3 className="w3-text-blue" style={{fontWeight: "bold"}} > Create New Account </h3>
        </header>
        <p className="w3-text-blue-grey">
          Please enter your email to create a new account
        </p>
        <p>
          <label> Email </label>
          <label className="w3-right w3-text-red"> {this.state.error} </label> 
          <input className = {`w3-input w3-border ${borderColor}`}
                type = "text" 
                placeholder = "email@examaple.com"
                value = {this.state.email}
                onChange = {this.getTypedEmail}
                onKeyUp = {this.handleKeyUp} 
                disabled = {this.state.syncing} 
          />
        </p>
        <button type="submit" className={`w3-button w3-blue w3-right`} onClick={this.onConfirm} disabled = {this.state.syncing} > 
          Next {' '}
          {
            this.state.syncing? <i className ="fa fa-refresh fa-spin" /> : <i className ="fa fa-chevron-right" />
          } 
        </button>
      </div>
    )
  }

  getTypedEmail(evt) {
    const email = evt.target.value;
    const error = email.length === 1 ? '' : this.state.error; 
    this.setState ({ email, error });
  }

  handleKeyUp(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.onConfirm()
    }
  }

  onConfirm() {

    let error = '';
    const email = this.state.email;

    if (!isEmail(email)) {
      error = 'Invalid Email Address';
      if (email.length === 0) {
        error = 'Email is empty';
      }
    }

    if (error.length !== 0) {
      this.setState({ error })
      return
    }

    this.setState({ syncing: true})
    xhttp.get(`${this.props.urlBasePath}/users?u=${email}`, (status, response) => {
      const syncing = false
      if (status === 404 && response === 'email not found') {
        this.setState({ email, error, syncing})
        this.props.onConfirm && this.props.onConfirm({email})
        return
      } 
      if (status === 200) {
        error = 'This email has been used'
        this.setState({ error, syncing })
        return
      }
      this.props.onError && this.props.onError(status)
    })

  }
}

class PasswordStrengthIndicator extends Component {
  constructor(props) {
    super(props);

    this.style = {
      node: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        marginRight: '3px'
      }
    }

    this.title = ['', 'Wreid', 'Wreid', 'Weak', 'Weak', 'Medium', 'Good', 'Awesome']

  }
  render() {
    const score = this.props.score;

    let color = '';
    if (score < 3) {
      color = 'red';
    }
    else if (score < 5) {
      color = 'orange'
    }
    else if (score === 5) {
      color = 'yellow'
    }
    else if (score === 6) {
      color = 'blue'
    }
    else if (score === 7) {
      color = 'green'
    }

    if (score) {
      const nodes = [...Array(7).keys()];
      return (
        <div style = {{height: '26px'}} className = 'w3-right'>
          {
            nodes.map( (i) => {
              const bgColor = i < score ? color : 'grey';
              return(
                <div className = {`w3-${bgColor}`} key = {i} style = {this.style.node} />
              )
            })
          }
          &nbsp; <label className = {`w3-text-${color}`}> {this.title[score]} </label>
        </div>
      )
    } else {
      return (
        <div style = {{height: '26px'}} className = 'w3-right' />
      )
    }
    
  }

}

class Password extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageBox1 : '',
      messageBox2 : '',
      password: '',
      score: 0,
      retypePassword: ''
    }

    this.onConfirm = this.onConfirm.bind(this);
    this.getTypedPassword = this.getTypedPassword.bind(this);
    this.getReTypePassword = this.getReTypePassword.bind(this);
    this.handleKeyUpForPassword = this.handleKeyUpForPassword.bind(this);
    this.handleKeyUpForRetypePassword = this.handleKeyUpForRetypePassword.bind(this)
    this._renderPasswordBox = this._renderPasswordBox.bind(this);
    this._renderConfirmButton = this._renderConfirmButton.bind(this);

  }

  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div className = "" style = {{ display }} >

        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <BackButton onClick = {this.props.back} />
        </header>
        

        <div className = "" >

          <div className ="w3-text-blue" >
            <h3> {this.props.data.email} </h3>
          </div>

          <hr />

          <div className ="w3-text-blue" >
            Create your secret password.
          </div>
          <div className ="w3-text-grey" >
            Your password should contain lower case, upper case, 
            at least one number and special characters.
          </div>

          <hr />

          {this._renderPasswordBox()}

          {this._renderConfirmButton()}

        </div>
      </div>
    )
  }

  getTypedPassword(evt) {
    const password = evt.target.value;
    const messageBox1 = password.length === 0 ? 'Password must not empty' : '';
    this.setState({ password, messageBox1 })
  }

  handleKeyUpForPassword(evt) {
    /* score password */
    const score = scorePassword(evt.target.value);
    this.setState({ score })
  }

  onConfirm() {
    const password = this.state.password;
    const retypePassword = this.state.retypePassword;
    /* validate password empty */
    if (password.length === 0) {
      this.setState({ messageBox1 : 'Password must not empty' });
      return
    }
    /* validate password match */
    if (password === retypePassword) {
      this.props.onConfirm && this.props.onConfirm({password});
    }
    else {
      this.setState({ messageBox2 : 'Password mismatch' })
    }
    
  }

  getReTypePassword(evt) {
    const retypePassword = evt.target.value;
    const messageBox2 = retypePassword.length === 0 ? '' : this.state.messageBox2;
    this.setState({ retypePassword, messageBox2 })
  }

  handleKeyUpForRetypePassword(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.onConfirm();
    }
  }

  _renderPasswordBox() {
    const borderColor1 = this.state.messageBox1.length > 0 ? 'w3-border-red': ''
    const borderColor2 = this.state.messageBox2.length > 0 ? 'w3-border-red': ''
    return (
      <div>

        {/* password */}
        <div>
          <div className = "w3-text-grey" style = {{marginBottom: '8px'}} > 
            Password
            <PasswordStrengthIndicator score = {this.state.score} />
          </div>
          <input  className = {`w3-input w3-border ${borderColor1}`}
                  type = "password" 
                  placeholder = "password"
                  value = {this.state.password}
                  onChange = {this.getTypedPassword}
                  onKeyUp = {this.handleKeyUpForPassword}
          />
          <Message message = {this.state.messageBox1} />

        </div>

        {/* retype password */}
        <div>
          <div className = "w3-text-grey" style = {{marginBottom: '8px'}} > 
            Retype Password
          </div>
          <input  className = {`w3-input w3-border ${borderColor2}`}
                  type = "password" 
                  placeholder = "retype your password"
                  value = {this.state.retypePassword}
                  onChange = {this.getReTypePassword}
                  onKeyUp = {this.handleKeyUpForRetypePassword} 
          />
          <Message message = {this.state.messageBox2} />
        </div>

      </div>
    )
  }

  _renderConfirmButton() {
    return (
      <div style = {{marginBottom: '72px'}}>
        <button className = {`w3-button w3-right w3-blue`}
                onClick = {this.onConfirm} > 
          Continue <i className ="fa fa-chevron-right" /> 
        </button>
      </div>
    )
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      gender: '',
      phone: [''],
      address: '',
    }

    this.onConfirm = this.onConfirm.bind(this)
    this.addPhoneBox = this.addPhoneBox.bind(this)

  }
  
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div className = "" style = {{ display }} >

        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <BackButton onClick = {this.props.back} />
        </header>

        <div className = "" >

          <div className ="w3-text-blue" >
            <h3> {this.props.data.email} </h3>
          </div>

          <hr />

          <div className ="w3-text-blue" >
            Please input your profile
          </div>

          <div style = {{marginBottom: '24px'}}>
            <p>
              <label>Full Name</label>
              <input  className="w3-input w3-border"
                      type="text"
                      value={this.state.fullName}
                      onChange = {this.getTyped('fullName')}
                      onKeyUp = {this.handleKeyUp('fullName')}
              />
            </p>
            <p>
              <label>Gender</label> <br />
              <span style={{marginRight: '32px'}}>
                <input  className="w3-radio" type="radio" name="gender" value="male" 
                        checked = {this.state.gender === 'male'}
                        onChange = { () => this.setState({gender: 'male'}) }
                />
                <label>Male</label>
              </span>
              <span>
                <input  className="w3-radio" type="radio" name="gender" value="female" 
                        checked = {this.state.gender === 'female'}
                        onChange = { () => this.setState({gender: 'female'}) }
                />
                <label>FeMale</label>
              </span>
            </p>
            <p>
              <label>Phone Number</label>
              {
                this.state.phone.map((phone, index) => {
                  return (
                    <span  key = {index} style={{display: 'block', marginBottom: '4px'}}>
                      <input  className = "w3-input w3-border"
                              type = "text"
                              value = {phone}
                              onChange = {this.getTyped('phone', index)}
                              onKeyUp = {this.handleKeyUp('phone', index)}
                      />
                      <label  className = "w3-text-blue" 
                              style = {{cursor: 'pointer', display: (index === this.state.phone.length - 1) ? 'inline' : 'none'}} 
                              onClick = {this.addPhoneBox} > 
                        + Add more phone number 
                      </label>
                    </span>
                  )

                })
              }
            </p>
            <p>
              <label>Address</label>
              <input    className="w3-input w3-border"
                        type="text"
                        value={this.state.address}
                        onChange = {this.getTyped('address')}
                        onKeyUp = {this.handleKeyUp('address')}
              />
            </p>
          </div>

          <div style = {{marginBottom: '72px'}}>
            <button className = {`w3-button w3-right w3-blue ${this.state.fullName.length === 0? 'w3-disabled' : ''}`}
                    onClick = {this.onConfirm} 
                    disabled = {this.state.fullName.length === 0} > 
                    Continue <i className ="fa fa-chevron-right" /> 
            </button>
          </div>
        

        </div>

      </div>
    )
  }

  getTyped(target, index) {
    if (index !== undefined) {
      return (evt) => {
        const state = {}
        state[target] = [...this.state[target]];
        state[target][index] = evt.target.value;
        this.setState(state)
      }
    } else {
      return (evt) => {
        const state = {}
        state[target] = evt.target.value;
        this.setState(state)
      }
    }
  }

  handleKeyUp(target) {
    return (evt) => {
      // console.log(evt.which + '/' + evt.keyCode)
    }
  }

  addPhoneBox() {
    const phone = [...this.state.phone];
    phone.push('');
    this.setState({ phone })
  }

  onConfirm() {
    const profile = {
      email: [this.props.data.email],
      fullName: this._formatName(this.state.fullName) || 'N/A',
      displayName: this._formatName(this.state.fullName) || 'N/A',
      gender: this.state.gender || 'N/A',
      phone: this.state.phone.filter(phone => phone.length > 0),
      address: this.state.address || 'N/A'
    }
    this.props.onConfirm && this.props.onConfirm({profile});
  }

  _formatName(name) {
    return this._toTitleCase(name.replace(/\s+/g, " ").trim());
  }

  _toTitleCase(phrase) {
    return phrase
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
  }

}

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      flow: 'email'
    }
    this.flow = ['email', 'password', 'profile', 'confirm', 'welcome']
    this.getData = this.getData.bind(this)
    this.back = this.back.bind(this)
  }

  render(props) {
    console.log(this.state.data)
    const urlBasePath = this.props.urlBasePath || ''
    return (
      <div className="w3-container" style={{ padding: "24px 12px", maxWidth: "460px" }}>
        <Email  display = {this.display('email')}
                data = {this.state.data}
                close = {this.props.close}
                onConfirm = {this.getData}
                urlBasePath = {urlBasePath}
                onError = {this.onError}   
        />
        <Password display = {this.display('password')}
                  data = {this.state.data}
                  close = {this.props.close}   
                  back = {this.back}
                  onConfirm = {this.getData}
        />
        <Profile display = {this.display('profile')}
                  data = {this.state.data}
                  close = {this.props.close}   
                  back = {this.back}
                  onConfirm = {this.getData}
        />
      </div>
    )
  }

  display(flow) {
    return this.state.flow === flow;
  }

  next() {
    const currentFlowIndex = this.flow.indexOf(this.state.flow)
    if (currentFlowIndex === -1) {
      return
    }
    if (currentFlowIndex === this.flow.length -1) {
      return
    }
    const nextFlow = this.flow[currentFlowIndex + 1]
    this.setState({ flow: nextFlow })
  }

  back() {
    const currentFlowIndex = this.flow.indexOf(this.state.flow)
    if (currentFlowIndex === -1) {
      return
    }
    if (currentFlowIndex === 0) {
      return
    }
    const previousFlow = this.flow[currentFlowIndex - 1]
    this.setState({ flow: previousFlow })
  }

  getData(data) {
    this.setState({data: {...this.state.data, ...data}})
    this.next()
  }

  onError(status) {
    console.log(status)
  }
}