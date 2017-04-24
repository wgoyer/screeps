var actions = require('creep.actions')
var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory['storage'] && creep.memory.storage == 'full') {
      actions.deposit(creep)
    } else {
      actions.harvest(creep)
    }
  }
}

module.exports = roleHarvester;
