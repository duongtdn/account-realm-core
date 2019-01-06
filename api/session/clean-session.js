"use strict"

function done() {
  return function(req, res) {
    res.end("clean-session: worked!\n")
  }
}

module.exports = done
