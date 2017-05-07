var cHelper = require('creep.helper')
var rHelper = require('room.helper')
var sHelper = require('structure.helper')

module.exports = {
  breed: function() {
    _spawnCreeps()
  }
}

var _spawnCreeps = function() {
  var spawns = sHelper.findAvailableSpawns()
  if(spawns) {
    for(var i = 0; i < spawns.length; i++) {
      _spawnCreep(spawns[i])
    }
  }
}

var _spawnCreep = function(spawn) {
  var room = rHelper.getRoomFromSpawn(spawn),
      energy = rHelper.getRoomAvailableSpawnEnergy(room),
      role = _getMostNeededRoleForRoom(room)
  if(role) {
    var template = _getHighestLevelTemplate(energy, role)
    if(template && _preRequisiteIsMet(template)) {
      var creepName = spawn.createCreep(template.bodyParts, {role: role.name, level: template.level})
      Game.creeps[creepName].memory['roomName'] = Game.creeps[creepName].room.name
      console.log(`👶 [${creepName}] [${role.name}] [${spawn.room.name}]`)
    }
  }
}

var _getMostNeededRoleForRoom = function(room) {
  var creeps = cHelper.getCreepsFromRoom(room)
  var roles = cHelper.getRoles()
  if(creeps) {
    for(var role in roles) {
      if(roles[role].minCount > cHelper.getCreepCountFromRoomByRole(room, role)) return roles[role]
    }

    for(var role in roles) {
      if(roles[role].maxCount > cHelper.getCreepCountFromRoomByRole(room, role)) return roles[role]
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
  if(preRequisite.type == 'flag') {
    var flagName = preRequisite.flagName.toLowerCase()
    for(var flag in Game.flags) {
      if(Game.flags[flag].name.toLowerCase() == flagName) return true
    }
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
  return highestAffordableTemplate.price > 0 ? highestAffordableTemplate : null
}
