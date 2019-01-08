"use strict"

function done() {
  return function(req, res) {
    res.end("sign-in-form: worked!\n")
  }
}

module.exports = done
