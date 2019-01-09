"use strict"

import React from 'react'
import { hydrate } from "react-dom"

import { postMessage } from "./message"
import SignUp from '../templates/components/SignUp'

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Form: document loaded')
  postMessage('iframe.loaded')
});


function xclose() {
  postMessage('iframe.close')
}

hydrate(<SignUp data = {window.DATA} close = {xclose} />, document.getElementById("root"))
