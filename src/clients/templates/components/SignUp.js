"use strict"

import React, { Component } from 'react'

import { xhttp, isEmail } from 'authenform-utils'

import BackButton from './widgets/BackButton'
import Message from './widgets/Message'
import NewPasswordBox from './widgets/NewPasswordBox';

class Email extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: 'awesome@team.com',
      error: '',
      syncing: false
    }
    this.getTypedEmail = this.getTypedEmail.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
    this._init = true
  }

  componentDidMount() {
    this._init = false
  }

  render(props) {
    const display = this.props.display ? 'block' : 'none';
    const borderColor = this.state.error.length === 0 ? '' : 'w3-border-red';
    return (
      <div className={this._init? 'w3-animate-top': ''} style={{ display }}>
        <header > 
          <span onClick={this.props.close} className="w3-button w3-right w3-red" style={{ display: (window.self === window.top)? 'none': 'block'}}>&times;</span>
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
            this.state.syncing? <i className ="fa fa-circle-o-notch fa-spin" /> : <i className ="fa fa-chevron-right" />
          } 
        </button>
      </div>
    )
  }

  getTypedEmail(evt) {
    const email = evt.target.value
    const error = ''
    this.setState ({ email, error })
  }

  handleKeyUp(evt) {
    if (evt.which === 13 || evt.keyCode === 13) {
      this.onConfirm()
    }
  }

  onConfirm() {

    if (this.state.error.length > 0) {
      return
    }

    let error = '';
    const email = this.state.email;

    if (this.props.data.email === email) {
      this.setState({ email, error, syncing: false})
      this.props.onConfirm && this.props.onConfirm({email})
      return
    }

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
      if (status === 404 ) {
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

class Password extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div style = {{ display }} >
        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red" style={{ display: (window.self === window.top)? 'none': 'block'}}>&times;</span>
          <BackButton onClick = {this.props.back} />
        </header>
        <div className = "" >
          <div className ="w3-text-blue" >
            <h3> {this.props.data.email} </h3>
          </div>
          <hr />
          <NewPasswordBox onConfirm = { (password, done) => { this.props.onConfirm && this.props.onConfirm({ password }); done(null) } }
                          btnLabel = 'Continue'           
                          icon = 'fa fa-chevron-right'
          />
        </div>
      </div>
    )
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: 'Awesome Tester',
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
      <div style = {{ display }} >

        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red" style={{ display: (window.self === window.top)? 'none': 'block'}}>&times;</span>
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
              <label>Address <span style={{fontStyle: 'italic'}}> (Optional. Need for delivery) </span> </label>
              <input    className="w3-input w3-border"
                        type="text"
                        value={this.state.address}
                        onChange = {this.getTyped('address')}
                        onKeyUp = {this.handleKeyUp('address')}
              />
            </p>
          </div>

          <div style = {{marginBottom: '42px', textAlign: 'right'}}>
            <button className = {`w3-button w3-blue ${this.state.fullName.length === 0? 'w3-disabled' : ''}`}
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
    /* extract display name from fullname */
    const lastWord = /(\w+)\W*$/.exec(this._formatName(this.state.fullName))
    const displayName = lastWord && lastWord.length > 0 ? lastWord[0].trim() : 'N/A' 
    /* construct profile */
    const profile = {
      email: [this.props.data.email],
      fullName: this._formatName(this.state.fullName) || 'N/A',
      displayName,
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

class Submit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked : false,
      syncing: false,
      error: ''
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this._renderAgreementBox = this._renderAgreementBox.bind(this);
    this._renderRegisterButton = this._renderRegisterButton.bind(this);

  }

  componentWillReceiveProps(props) {
    if (!this.props.display) {
      this.setState({ checked : false });
    }
  }
  
  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div style = {{ display }} >

        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red" style={{ display: (window.self === window.top)? 'none': 'block'}}>&times;</span>
          <BackButton onClick = {this.props.back} />
        </header>

        <div className = "" >

          {this._renderAgreementBox()}

          <hr />

          {this._renderRegisterButton()}

        </div>

      </div>
    )
  }

  onSubmit() {
    const user = this.props.data
    this.setState({ syncing : true })
    xhttp.post(`${this.props.urlBasePath}/users`, { user, realm: window.__data.realm }, (status, response) => {
      const syncing = false
      if (status === 200) {
        this.setState({ error: '', syncing })
        const session = JSON.parse(response)
        this.props.onSuccess && this.props.onSuccess(session)
        return
      } 
      if (status !== 200) {
        const error = `An error occur during submitting. Error: ${status}`
        this.setState({ error, syncing })
        return
      }
    })
  }

 _renderAgreementBox() {
  return (
    <div className = "w3-text-grey">
      <div style = {{marginBottom: '8px'}} >
        Please read the <a className = "w3-text-blue" href = {this.props.TermsAndServicesLink} > Terms and Services </a> Agreement. 
        Check the box if you accept them.
      </div>
      <div style = {{marginBottom: '16px'}} >
          <input className = "w3-check" 
                 type="checkbox" 
                 checked = {this.state.checked}
                 onChange = {this.toggleChecked} />
          <label> Agree <a>Terms & Services</a> </label>
      </div>
    </div>
  )
 }

 toggleChecked() {
   this.setState({ checked: !this.state.checked });
 }

  _renderRegisterButton() {
    const disabled = this.props.syncing || !this.state.checked ? 'disabled' : '';
    return (
      <div>        
        <div style = {{marginBottom: '24px'}}>
          <button className = {`w3-button w3-block w3-blue w3-${disabled}`}
                  onClick = {this.onSubmit} disabled = {disabled.length > 0 ? true : false} > 
            {
              this.state.syncing? 'Submitting...' : 'Submit' 
            }
          </button>
        </div>
      </div>
    )
  }

}

class Welcome extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    const display = this.props.display ? 'block' : 'none';
    return (
      <div className={`w3-animate-top`} style = {{ display }} >
        
        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red" style={{ display: (window.self === window.top)? 'none': 'block'}}>&times;</span>
        </header>

        <div className = "" >

          <div >
            <h3> Welcome {this.props.data.profile && this.props.data.profile.displayName} </h3>
          </div>

          <p className ="w3-text-blue" >
            Your new account was created
          </p>

          <p className ="w3-text-blue-grey" >
            We have send an email to your email: <span style={{fontWeight: 'bold'}}> {this.props.data.profile && this.props.data.profile.email[0]} </span> to verify your owner at the last step. 
          </p>

          <p className ="w3-text-blue-grey" >
            To enable all services. Please follow the instruction in the email to activate your account.
          </p>

          <p className ="w3-text-blue-grey">
            Thank you for signing up and using our service.
          </p>

          <div style = {{display: (window.self === window.top)? 'none': 'block', marginBottom: '72px'}}>
            <button className = {`w3-button w3-blue`}
                    onClick = {this.props.close} > 
              Close 
            </button>
          </div>

        </div>

      </div>
    )
  }
}

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      flow: 'email'
    }
    this.flow = ['email', 'password', 'profile', 'submit', 'welcome']
    this.getData = this.getData.bind(this)
    this.onReceivedSession = this.onReceivedSession.bind(this)
    this.back = this.back.bind(this)
  }

  render(props) {
    const urlBasePath = this.props.urlBasePath || ''
    return (
      <div className="w3-container" style={{ padding: "10px 12px", maxWidth: "460px" }}>
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
        <Submit   display = {this.display('submit')}
                  data = {this.state.data}
                  close = {this.props.close}   
                  back = {this.back}
                  onSuccess = {this.onReceivedSession}
                  TermsAndServicesLink = '#'
                  urlBasePath = {urlBasePath}
        />
        <Welcome  display = {this.display('welcome')}
                  data = {this.state.data}
                  close = {this.props.close}   
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

  onReceivedSession(session) {
    this.props.onSuccess(session)
    this.next()
  }

  onError(status) {
    console.log(status)
  }
}