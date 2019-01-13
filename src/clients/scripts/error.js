"use strict"

import React from 'react'
import { render } from "react-dom"

import { postMessage } from "./message"
import Error from '../templates/components/Error'

document.addEventListener("DOMContentLoaded", function(event) {
  postMessage('iframe.loaded').catch((err) => console.error(err))
  postMessage('iframe.done', { status: window.__data.error.code })
})

render(<Error code = {window.__data.error.code} detail = {window.__data.error.detail} />, document.getElementById("root"))

