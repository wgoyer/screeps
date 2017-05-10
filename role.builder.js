var actions = require('creep.actions')
var sHelper = require('structure.helper')
var cHelper = require('creep.helper')
var rHelper = require('room.helper')

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var buildTarget = sHelper.findClosestConstructionSite(creep),
        creepHasNRG = cHelper.creepHasEnergy(creep),
        roomHasNRG = sHelper.findClosestEnergyToWithdraw(creep)
    if(buildTarget && creepHasNRG) return actions.build(creep, buildTarget)
    if(buildTarget && !creepHasNRG && roomHasNRG) return actions.withdrawEnergy(creep)

    var room = rHelper.getRoomFromCreep(creep),
        roomNeedsNRG = rHelper.roomNeedsSpawnEnergy(room)
    if(creepHasNRG && roomNeedsNRG) return actions.deposit(creep) // If creep has enery, and room needs it, deposit.
    if(!creepHasNRG && roomNeedsNRG) return actions.harvest(creep) // If creep doesn't have energy, and room needs it, harvest.
    if(creepHasNRG && !roomNeedsNRG) return actions.upgrade(creep) // If creep has energy and room doesn't need it, upgrade room.
    return actions.harvest(creep)
  },

  runInvader: function(creep) {
    var buildTarget = sHelper.findClosestConstructionSite(creep),
        creepHasNRG = cHelper.creepHasEnergy(creep)
    if(buildTarget && creepHasNRG) return actions.build(creep, buildTarget)
    if(!buildTarget && creepHasNRG) return actions.upgrade(creep)
    if(!creepHasNRG) return actions.newHarvest(creep)
  }
}
