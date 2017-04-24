var actions = require('creep.actions')
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory['storage'] && creep.memory.storage == 'full') {
      actions.upgrade(creep)
    } else {
      actions.harvest(creep)
    }
  }
}

module.exports = roleUpgrader
