var sHelper = require('structure.helper')
var cHelper = require('creep.helper')

module.exports = {
  run: function() {
    var towers = sHelper.findTowers()
    for(var i = 0; i < towers.length; i++) {
      _runTower(towers[i])
    }
  }
}

var _runTower = function(tower) {
  var closestHostile, closestDamagedStructure, closestDamagedCreep
  closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  if(closestHostile) return tower.attack(closestHostile)

  closestDamagedStructure = sHelper.findClosestDamagedStructure(tower)
  if(closestDamagedStructure) return tower.repair(closestDamagedStructure)

  closestDamagedCreep = cHelper.findClosestDamagedCreep(tower)
  if(closestDamagedCreep) return tower.heal(closestDamagedCreep)
}
