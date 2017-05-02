var cHelper = require('creep.helper'),
    roleHarvester = require('role.harvester'),
    roleUpgrader = require('role.upgrader'),
    roleBuilder = require('role.builder'),
    roleDefender = require('role.defender')

module.exports = {
  run: function() {
    var creeps = cHelper.getCreeps()
    for(var i = 0; i < creeps.length; i++) {
      if(creeps[i].memory.role == 'harvester') roleHarvester.run(creeps[i])
      if(creeps[i].memory.role == 'upgrader') roleUpgrader.run(creeps[i])
      if(creeps[i].memory.role == 'builder') roleBuilder.run(creeps[i])
      if(creeps[i].memory.role == 'defender') roleDefender.run(creeps[i])
    }
  }
}

// var _buildTargetExists = function() {
//   return Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).length > 0
// }

// var _spawnHasCapacity = function() {
//   var room = Game.rooms[roomName]
//   return room.energyCapacityAvailable > room.energyAvailable
// }
