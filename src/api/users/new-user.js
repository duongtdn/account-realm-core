"use strict"

function done() {
  return function(req, res) {
    res.end("new-user: worked!\n")
  }
}

module.exports = done
