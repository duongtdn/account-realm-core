"use strict"

function done() {
  return function(req, res) {
    res.status(404).send("email not found")
  }
}

module.exports = done