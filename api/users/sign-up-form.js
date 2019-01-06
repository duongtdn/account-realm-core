"use strict"

function done() {
  return function(req, res) {
    res.end("sign-up-form: worked!\n")
  }
}

module.exports = done
