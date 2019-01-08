"use strict"

function done() {
  return function(req, res) {
    res.status(200).send("email not found")
  }
}

module.exports = done