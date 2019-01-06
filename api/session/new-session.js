"use strict"

function done() {
  return function(req, res) {
    res.end("new-session: worked!\n")
  }
}

module.exports = done
