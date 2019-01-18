"use strict"

import React from 'react'
import { render } from "react-dom"

import NewPasswordForm from '../templates/components/NewPasswordForm'

document.addEventListener("DOMContentLoaded", function(event) {
  render(<NewPasswordForm urlBasePath = '' />, document.getElementById("root"))
});