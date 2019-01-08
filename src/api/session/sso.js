"use strict"

function done() {
  return function(req, res) {
    res.end("sso: worked!\n")
  }
}

module.exports = done
