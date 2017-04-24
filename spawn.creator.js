var structures = require('structure.helper')
var roomName = 'W5N8'
module.exports = {
  breed: function() {
    var spawnToUse = structures.findAvailableSpawn()
    var availableEnergy = _getAvailableSpawnEnergy()
    if(spawnToUse) _spawnCreep(spawnToUse, availableEnergy)
  }
}

var _spawnCreep = function(spawn, energy, count) {
  count = count ? count : 0
  var roles = ['harvester', 'upgrader', 'builder']
  var maxCreepCount = 4
  if(_getCreepCount(roles[count]) < maxCreepCount) {
    var creepTemplate = _getHighestLevelTemplate(energy)
    if(creepTemplate) {
      return spawn.createCreep(creepTemplate.bodyParts, {role: roles[count], level: creepTemplate.level})
    } else {
      return
    }
  }
  count++
  if(count < (roles.length)) {
    return _spawnCreep(spawn, energy, count)
  } else {
    return
  }
}

var _getCreepCount = function(creepRole) {
  var creepCount = 0
  for(var creep in Game.creeps) {
    if(Game.creeps[creep].memory.role == creepRole) {
      creepCount++
    }
  }
  return creepCount
}

var _getAvailableSpawnEnergy = function() {
  return Game.rooms[roomName].energyAvailable
}

var _getHighestLevelTemplate = function(energy) {
  var highestAffordableTemplate = {price:0}
  var tempTemplate
  for(var template in _baseCreeps) {
    tempTemplate = _baseCreeps[template]
    if(tempTemplate.price <= energy && tempTemplate.price > highestAffordableTemplate.price) {
      highestAffordableTemplate = tempTemplate
    }
  }
  return highestAffordableTemplate
}

/**
  BodyPart Prices:
  tough: 10
  move: 50
  carry: 50
  attack: 80
  work: 100
  ranged_attack:150
  heal: 250
  claim: 600
**/

var _baseCreeps = {
  levelZero: {
    level: 0,
    bodyParts: [WORK, MOVE, CARRY],
    price: 200
  },
  levelOne: {
    level: 1,
    bodyParts: [WORK, WORK, MOVE, CARRY],
    price: 300
  },
  levelTwo: {
    level: 2,
    bodyParts: [WORK, WORK, MOVE, CARRY, CARRY],
    price: 350
  },
  levelThree: {
    level: 3,
    bodyParts: [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY],
    price: 500
  }
}
