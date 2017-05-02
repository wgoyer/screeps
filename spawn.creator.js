var creepHelper = require('creep.helper')
var roomHelper = require('room.helper')
var structures = require('structure.helper')

var roomName = 'W5N8'
module.exports = {
  breed: function() {
    _spawnCreep()
  }
}

var _spawnCreep = function() {
  var spawn = structures.findAvailableSpawn()
  if(spawn) {
    var energy = _getAvailableSpawnEnergy()
    var role = _getMostNeededRole()
    if(role) {
      var template = _getHighestLevelTemplate(energy, role)
      if(template) {
        console.log(`Spawning: ${role.name}`)
        spawn.createCreep(template.bodyParts, {role: role.name, level: template.level})
      }
    }
  }
}

var _getMostNeededRole = function() {
  var creeps = creepHelper.getCreeps()
  var roles = creepHelper.getRoles()
  if(creeps) {
    for(var role in roles) {
      if(roles[role].minCount > creepHelper.getCreepCount(role)) return roles[role]
    }

    for(var role in roles) {
      if(roles[role].maxCount > creepHelper.getCreepCount(role)) return roles[role]
    }

  } else {
    for(var role in roles) {
      if(roles[role].priority == 0) return roles[role]
    }
  }
}

var _getAvailableSpawnEnergy = function() {
  return Game.rooms[roomName].energyAvailable
}

var _getHighestLevelTemplate = function(energy, role) {
  var highestAffordableTemplate = {price:0}
  var tempTemplate
  for(var template in role.template) {
    tempTemplate = role.template[template]
    if(tempTemplate.price <= energy && tempTemplate.price > highestAffordableTemplate.price) {
      highestAffordableTemplate = tempTemplate
    }
  }
  return highestAffordableTemplate
}
