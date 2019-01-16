"use strict"

import React, { Component } from 'react'

import { xhttp, isEmail } from 'authenform-utils'
import BackButton from './widgets/BackButton'

class Email extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: 'initiator@test.com',
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
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <h3 className="w3-text-blue" style={{fontWeight: "bold"}} > Sign In </h3>
        </header>
        <p className="w3-text-blue-grey">
          Please enter your email 
        </p>
        <p>
          <label> Email </label>
          <label className="w3-right w3-text-red"> {this.state.error} </label> 
          <input className = {`w3-input w3-border ${borderColor}`}
                type = "text" 
                placeholder = "email@example.com"
                value = {this.state.email}
                onChange = {this.getTypedEmail}
                onKeyUp = {this.handleKeyUp} 
                disabled = {this.state.syncing} 
          />
        </p>
        <div style = {{marginBottom: '42px'}}>
        <div className="w3-cell-row">
            <div className="w3-cell">
              {/* <label className="w3-text-red w3-large"><a href={`${this.props.urlBasePath}/users/new?realm={realm}&app={app}`}> Create New Account </a></label> */}
              <label className="w3-text-red w3-large"><a href={`${this.props.urlBasePath}/users/new?realm=realm&app=dev`}> Create New Account </a></label>
            </div>
            <div className="w3-cell" style={{textAlign: 'right'}}>
              <button type="submit" className={`w3-button w3-blue `} onClick={this.onConfirm} disabled = {this.state.syncing} > 
                Next {' '}
                {
                  this.state.syncing? <i className ="fa fa-circle-o-notch fa-spin" /> : <i className ="fa fa-chevron-right" />
                } 
              </button>
            </div>
          </div>
        </div>
        
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
      if (status === 200 ) {
        this.setState({ email, error, syncing})
        this.props.onConfirm && this.props.onConfirm({email})
        return
      } 
      if (status === 404) {
        error = 'This email has not registered'
        this.setState({ error, syncing })
        return
      }
      this.props.onError && this.props.onError(status)
    })

  }
}

class Password extends Component {
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
    const display = this.props.display ? 'block' : 'none';
    const borderColor = this.state.error.length > 0 ? 'w3-border-red': ''
    return (
      <div style = {{ display }} >

        <header >
          <span onClick={this.props.close} className="w3-button w3-right w3-red">&times;</span>
          <BackButton onClick = {this.props.back} />
        </header>

        <div className = "" >

          <div className ="w3-text-blue" >
            <h3> {this.props.data.email} </h3>
          </div>
          
          <p>
            <label>Password</label>
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
            <label className="w3-text-orange "><a href="#"> Forgot your password </a></label>
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
    const username = this.props.data.email
    const password = this.state.password
    this.setState({ syncing : true })
    xhttp.post(`${this.props.urlBasePath}/session`, { username, password, realm: window.__data.realm },  (status, response) => {
      const syncing = false
      if (status === 200) {
        this.setState({ error: '', syncing })
        const session = JSON.parse(response)
        this.props.onSignedIn && this.props.onSignedIn(session)
        return
      } 
      if (status === 401) {
        const error = `Invalid password`
        this.setState({ error, syncing })
        return
      }
      if (status !== 200) {
        const error = `An error occur during singing in. Error: ${status}`
        this.setState({ error, syncing })
        return
      }
    })
  }
}

class Welcome extends Component {
  constructor(props) {
    super(props)
    this._timer = null
  }

  componentWillReceiveProps(props) {
    if (props.display && !this.props.display) {
      this._timer = setTimeout(() => {
        clearTimeout(this._timer)
        this.props.close && this.props.close()
      }, 1500)
    }
  }


  render() {
    const display = this.props.display ? 'block' : 'none'
    const user = this.props.session && this.props.session.user ? this.props.session.user : {}
    return (
      <div className={`w3-animate-top`} style = {{ display }} >
        
        
        <div className = "" style = {{textAlign: 'center'}} >

          <div >
            <h3> Welcome {user.profile && user.profile.displayName} </h3>
          </div>

          <p>
            You have signed in.
          </p>

        </div>


      </div>
    )
  }

}

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      flow: 'email',
      session: null
    }
    this.flow = ['email', 'password', 'welcome']
    this.getData = this.getData.bind(this)
    this.back = this.back.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
  }

  render() {
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
                  onSignedIn= {this.onSuccess}
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

  onSuccess(session) {
    this.setState({session})
    this.props.onSuccess && this.props.onSuccess(session)
    this.next()
  }

}
