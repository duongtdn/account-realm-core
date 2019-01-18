"use strict"

function final() {
  return function(req, res) {
    res.status(200).send('success')
  }
}

module.exports = final