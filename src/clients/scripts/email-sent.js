"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import EmailSent from '../templates/components/EmailSent'

document.addEventListener("DOMContentLoaded", function(event) {
  postMessage('iframe.loaded', {height: 415, width: 460})
  render(<EmailSent close = {xclose} showCloseButton={true} />, document.getElementById("root"))
});

function xclose() {
  postMessage('iframe.close')
}
