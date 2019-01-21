"use strict"

import React from 'react'
import { render } from "react-dom"

import InfoPage from '../templates/components/InfoPage'

const messages = [
  'Your email has beed verified successfully',
  'Thank you for using our service'
]

document.addEventListener("DOMContentLoaded", function(event) {
  render(<InfoPage title = 'Email is verified' messages = {messages} />, document.getElementById("root"))
});