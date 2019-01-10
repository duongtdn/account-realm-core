"use strict"

import React from 'react'
import { hydrate, render } from "react-dom"

import { postMessage } from "./message"
import SignUp from '../templates/components/SignUp'

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Form: document loaded')
  postMessage('iframe.loaded')
});

window.addEventListener("message", (event) => {
  if (event.origin !== __data.targetOrigin) {
    return
  }
  if (event.data === 'iframe.ack') {
    render(<SignUp close = {xclose} />, document.getElementById("root"))
  }
})


function xclose() {
  postMessage('iframe.close')
}
