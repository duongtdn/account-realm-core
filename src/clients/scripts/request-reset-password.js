"use strict"

import React from 'react'
import { render } from "react-dom"

import RequestResetPassword from '../templates/components/RequestResetPassword'

document.addEventListener("DOMContentLoaded", function(event) {
  render(<RequestResetPassword email = {__data.query.email} />, document.getElementById("root"))
});