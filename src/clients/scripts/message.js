"use strict"

export function postMessage(code) {
  if (!window.parent) {
    return
  }

  const target = window.parent  
  const msg = { code: code }
  if (code === 'iframe.done') {
    msg.status = status
    const obj = JSON.parse(message)
    for (let k in obj) {
      msg[k] = obj[k]
    }
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