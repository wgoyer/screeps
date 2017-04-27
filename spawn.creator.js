var structures = require('structure.helper')
var roomName = 'W5N8'
var maxCreepCount = 5
module.exports = {
  breed: function() {
    var spawnToUse = structures.findAvailableSpawn()
    var availableEnergy = _getAvailableSpawnEnergy()
    if(spawnToUse) _spawnCreep(spawnToUse, availableEnergy)
  },
  specialOrder: function() {
    var buildingWithSpecialOrders = structures.findSpecialOrders('spawn', 'breed')
    if(buildingWithSpecialOrders) {
      var specialOrders = buildingWithSpecialOrders.memory.specialOrder
      var spawnToUse = structures.findAvailableSpawn()
      if(spawnToUse && _specialOrderIsValid(specialOrders)) {
        var bodyParts = specialOrders.templateName ? _baseCreeps[specialOrders.templateName].bodyParts : specialOrders.bodyParts
        if(_energyIsAvailableToBreed(bodyParts)) {
          if(typeof(spawnToUse.createCreep(bodyParts, {role: specialOrders.role, level: specialOrders.level})) == 'string') {
            console.log('Special breed order executed, deleting order')
            delete(buildingWithSpecialOrders.memory.specialOrders)
          } else {
            console.log('Failed to execute special breed order.  Spawn command didn\'t work')
          }
        } else {
          console.log('Failed to execute special breed order.  Not enough energy')
        }
      } else {
        console.log('Failed to execute special breed order.  No available spawn, or bad object')
      }
    }
  }
}

var _spawnCreep = function(spawn, energy, count) {
  count = count ? count : 0
  var roles = ['harvester', 'upgrader', 'builder']
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

var _specialOrderIsValid = function(specialOrder) {
  if((specialOrder.template || specialOrder.bodyParts) && (specialOrder.role && specialOrder.level)) {
    return true
  }
  console.log('Bad order object should be: {template: templateName || bodyParts: [PARTS], role: roleName, level: #}')
  return false
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

var _energyIsAvailableToBreed = function(bodyParts) {
  var prices = {
    tough: 10,
    move: 50,
    carry: 50,
    attack: 80,
    work: 100,
    ranged_attack: 150,
    heal: 250,
    claim: 600
  }
  var availableEnergy = _getAvailableSpawnEnergy()
  var totalCost = -1

  for(var i = 0; i < bodyParts.length; i++) {
    totalCost = totalCost + prices[bodyParts[i]]
  }
  return totalCost > -1 && totalCost <= availableEnergy
}

var _baseCreeps = {
  levelZero: {
    level: 0,
    bodyParts: [WORK, MOVE, CARRY],
    price: 200
  },
  levelOne: {
    level: 1,
    bodyParts: [WORK, MOVE, MOVE, CARRY, CARRY],
    price: 300
  },
  levelTwo: {
    level: 2,
    bodyParts: [WORK, MOVE, MOVE, CARRY, CARRY, CARRY],
    price: 350
  },
  levelThree: {
    level: 3,
    bodyParts: [WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
    price: 500
  }
}
