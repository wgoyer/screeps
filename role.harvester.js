var actions = require('creep.actions'),
    cHelper = require('creep.helper'),
    sHelper = require('structure.helper'),
    rHelper = require('room.helper')

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var room = rHelper.getRoomFromCreep(creep),
        creepHasNRG = cHelper.creepHasEnergy(creep),
        roomHasCapacity = rHelper.roomHasEnergyCapacity(room),
        roomHasNeedyTowers = sHelper.findNeedyTower(creep)

    if(!creepHasNRG) return actions.harvest(creep)
    if(creepHasNRG && roomHasCapacity || roomHasNeedyTowers) return actions.deposit(creep)
    if(creepHasNRG && !roomHasCapacity) return actions.upgrade(creep)
  }
}

module.exports = roleHarvester
