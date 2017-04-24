var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roles = ['harvester', 'upgrader', 'builder']
module.exports = {
  run: function() {
    var creeps = _getCreeps()
    for(var i = 0; i < creeps.length; i++) {
      if(creeps[i].memory.role == 'harvester') {
        if(_spawnHasCapacity()) {
          roleHarvester.run(creeps[i])
        } else {
          roleUpgrader.run(creeps[i])
        }
      }
      if(creeps[i].memory.role == 'upgrader') roleUpgrader.run(creeps[i])
      if(creeps[i].memory.role == 'builder') {
        if(_buildTargetExists()) {
          roleBuilder.run(creeps[i])
        } else {
          roleUpgrader.run(creeps[i])
        }
      }
    }
  }
}

var _getCreeps = function() {
  var creeps = []
  for(var creep in Game.creeps) {
    creeps.push(Game.creeps[creep])
  }
  return creeps
}

var _buildTargetExists = function() {
  return Game.rooms['sim'].find(FIND_CONSTRUCTION_SITES).length > 0
}

var _spawnHasCapacity = function() {
  var room = Game.rooms['sim']
  return room.energyCapacityAvailable > room.energyAvailable
}
