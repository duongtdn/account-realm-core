"use strict"

import { postMessage } from "./message"

document.addEventListener("DOMContentLoaded", function(event) {
  postMessage('iframe.loaded')
  postMessage('iframe.done', { status: 200, session: null })
})


