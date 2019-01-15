"use strict"

export function postMessage(code, data) {
  const target = window.parent  
  const msg = { code: code }
  for (let prop in data) {
    msg[prop] = data[prop]
  }
  if (code === 'iframe.done') {    
    const status = data.status
    if (status == 200 || status == 404) {
      target.postMessage(msg, window.__data.targetOrigin)
    } else if (status == 403) {
      target.postMessage(msg, "*")
      throw new Error('403 Forbidden')
    }
  } else {
    target.postMessage(msg, window.__data.targetOrigin)
  }
}