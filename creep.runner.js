var creepHelper = require('creep.helper')

var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleDefender = require('role.defender')

var roles = ['harvester', 'upgrader', 'builder']
var roomName = 'W5N8'
module.exports = {
  run: function() {
    var creeps = creepHelper.getCreeps()
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
          roleHarvester.run(creeps[i])
        }
      }
      if(creeps[i].memory.role == 'defender') roleDefender.run(creeps[i])
    }
  }
}

var _buildTargetExists = function() {
  return Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).length > 0
}

var _spawnHasCapacity = function() {
  var room = Game.rooms[roomName]
  return room.energyCapacityAvailable > room.energyAvailable
}
