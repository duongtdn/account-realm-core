"use strict"

function done() {
  return function(req, res) {
    const user = req.body.user
    console.log(user)
    setTimeout(() => {
      res.status(200).json({user})
    }, 2000)
  }
}

module.exports = done
