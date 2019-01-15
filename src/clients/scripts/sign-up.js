"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import SignUp from '../templates/components/SignUp'

document.addEventListener("DOMContentLoaded", function(event) {
  postMessage('iframe.loaded',  {height: 615})
  render(<SignUp close = {xclose} onSuccess={onSignupSuccess} />, document.getElementById("root"))
});

function xclose() {
  postMessage('iframe.close')
}

function onSignupSuccess(session) {
  postMessage('iframe.done', { status: 200, session })
}