var structs = require('structure.helper')

module.exports = {
  run: function() {
    var towers = structs.findTowers()
    for(var i = 0; i < towers.length; i++) {
      _findAndAttackHostile(towers[i])
      _findAndRepairStructure(towers[i])
      _findAndHealCreep(towers[i])
    }
  }
}

var _findAndAttackHostile = function(tower) {
  var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if(closestHostile) tower.attack(closestHostile)
}

var _findAndRepairStructure = function(tower) {
  var filter = {filter: function(structure) { return structure.hits < structure.hitsMax }}
  var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, filter)
  if(closestDamagedStructure) tower.repair(closestDamagedStructure)
}

var _findAndHealCreep = function(tower) {
  var filter = {filter: function(creep) { return creep.hits < creep.hitsMax }}
  var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, filter)
  if(closestDamagedCreep) tower.heal(closestDamagedCreep)
}
