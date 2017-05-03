var cHelper = require('creep.helper')
var rHelper = require('room.helper')
var sHelper = require('structure.helper')

module.exports = {
  breed: function() {
    _spawnCreep()
  }
}

var _spawnCreep = function() {
  var spawn = sHelper.findAvailableSpawn()
  if(spawn) {
    var room = rHelper.getRoomFromSpawn(spawn),
        energy = rHelper.getRoomAvailableSpawnEnergy(room),
        role = _getMostNeededRole()
    if(role) {
      var template = _getHighestLevelTemplate(energy, role)
      if(template && _preRequisiteIsMet(template)) {
        var creepName = spawn.createCreep(template.bodyParts, {role: role.name, level: template.level})
        console.log(`Spawned: ${creepName} - ${role.name}`)
      }
    }
  }
}

var _getMostNeededRole = function() {
  var creeps = cHelper.getCreeps()
  var roles = cHelper.getRoles()
  if(creeps) {
    for(var role in roles) {
      if(roles[role].minCount > cHelper.getCreepCount(role)) return roles[role]
    }

    for(var role in roles) {
      if(roles[role].maxCount > cHelper.getCreepCount(role)) return roles[role]
    }

  } else {
    for(var role in roles) {
      if(roles[role].priority == 0) return roles[role]
    }
  }
}

var _preRequisiteIsMet = function(template) {
  var preRequisite = template.preRequisite
  if(!preRequisite) return true
  if(preRequisite.type == 'memory') {
    var keyValue = Memory[preRequisite.key]
    if(preRequisite.value == 'boolean') return keyValue || false
  }
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
