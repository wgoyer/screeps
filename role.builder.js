var actions = require('creep.actions')
var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.storage && creep.memory.storage == 'full') {
      actions.build(creep)
    } else {
      actions.harvest(creep)
    }
  }
}

module.exports = roleBuilder;
