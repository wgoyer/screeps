var actions = require('creep.actions')
var cHelper = require('creep.helper')

module.exports = {
  run: function(creep) {
    if(Game.flags['Invader'].room == creep.room) {
      if(cHelper.creepHasEnergy(creep)) {
        actions.upgrade(creep)
      }
      if(!cHelper.creepHasEnergy(creep)) actions.harvest(creep)
    } else {
      creep.moveTo(Game.flags['Invader'])
    }

    // if(creep.memory.idle) {
    //   if(cHelper.creepHasEnergy(creep)) {
    //     actions.upgrade(creep)
    //   } else {
    //     actions.harvest(creep)
    //   }
    // } else {
    //   actions.invade(creep)
    // }
    // if(cHelper.creepHasEnergy(creep)) {
    //   actions.upgrade(creep)
    // }
  }
}
