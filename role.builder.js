var actions = require('creep.actions')
var structures = require('structure.helper')
var creepHelper = require('creep.helper')

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var buildTarget = structures.findClosestConstructionSite(creep)
    if(buildTarget) {
      if(creepHelper.creepHasEnergy(creep)) {
        actions.build(creep, buildTarget)
      } else {
        actions.withdrawEnergy(creep)
      }
    } else {
      actions.harvest(creep)
    }
  }
}

module.exports = roleBuilder
