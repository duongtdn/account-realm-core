"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import SignIn from '../templates/components/SignIn'

document.addEventListener("DOMContentLoaded", function(event) {
  postMessage('iframe.loaded', {height: 415, width: 460})
  render(<SignIn close = {xclose} onSuccess={onSigninSuccess} />, document.getElementById("root"))
});

function xclose() {
  postMessage('iframe.close')
}

function onSigninSuccess(session) {  
  postMessage('iframe.done', { status: 200, session })
}