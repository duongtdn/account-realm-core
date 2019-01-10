"use strict"

export function postMessage(code) {
  return new Promise( (resolve, reject) => {
    if (!window.parent) {
      reject()
      return
    }
    if (__data.error) {
      reject({..._data.error})
      return
    }
    if (!__data.targetOrigin) {
      reject({code: '403 Fobidden', detail: ''})
      return
    }
    if (!document.referrer) {
      reject({code: '403 Fobidden', detail: ''})
      return
    }
    if (document.referrer.replace(/\/+$/, '') === window.__data.targetOrigin.replace(/\/+$/, '')) {
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
      resolve()
    } else {
      reject({code: '403 Fobidden', detail: 'Cross Origin Blocked'})
    }
  })
  
}