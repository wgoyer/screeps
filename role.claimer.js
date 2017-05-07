var rHelper = require('room.helper')
var actions = require('creep.actions')

module.exports = {
  run: function(creep) {
    actions.claim(creep)
  }
}
