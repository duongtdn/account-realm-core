"use strict"

export default {
  get(path, done) {
    setTimeout(() => {
      done(200, 'email')
    }, 2000)
  }
}