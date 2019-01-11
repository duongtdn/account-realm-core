"use strict"

function done(helpers) {
  return function(req, res) {
    const username = req.query.u
    helpers.Collections.Users.find({ username }, (users) => {
      if (users && users[0]) {
        /* todo: serialize user according role of requester. e.g. admin can see more information whay anonymous only see email */ 
        res.status(200).json({ user: username })
      } else {
        res.status(404).json({ user: null })
      }
    })    
  }
}

module.exports = done