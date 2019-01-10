"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import SignUp from '../templates/components/SignUp'
import Error from '../templates/components/Error'

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Form: document loaded')
  postMessage('iframe.loaded')
    .then( _ => render(<SignUp close = {xclose} />, document.getElementById("root")))
    .catch( err => render(<Error code = {err.code} detail = {err.detail} />, document.getElementById("root")))
});

function xclose() {
  postMessage('iframe.close')
}
