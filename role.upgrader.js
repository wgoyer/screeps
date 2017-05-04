var actions = require('creep.actions')
var cHelper = require('creep.helper')
var rHelper = require('room.helper')


var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var room = rHelper.getRoomFromCreep(creep),
        creepHasNRG = cHelper.creepHasEnergy(creep),
        roomHasNRG = rHelper.roomHasWithdrawableEnergy(creep)

    if(creepHasNRG) return actions.upgrade(creep)
    if(!creepHasNRG && roomHasNRG) return actions.withdrawEnergy(creep)
    if(!creepHasNRG && !roomHasNRG) return actions.harvest(creep)
  },

  runInvader: function(creep) {
    var room = rHelper.getRoomFromCreep(creep),
        creepHasNRG = cHelper.creepHasEnergy(creep)

    if(creepHasNRG) return actions.upgrade(creep)
    if(!creepHasNRG) return actions.newHarvest(creep)
  }
}

module.exports = roleUpgrader
