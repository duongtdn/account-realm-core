"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import RequestResetPassword from '../templates/components/RequestResetPassword'

document.addEventListener("DOMContentLoaded", function(event) {
  render(<RequestResetPassword close = {xclose} email = {__data.query.email} />, document.getElementById("root"))
});

function xclose() {
  postMessage('iframe.close')
}