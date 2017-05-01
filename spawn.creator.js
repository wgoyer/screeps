var structures = require('structure.helper')
var roomName = 'W5N8'
var maxCreepCount = 5
var maxDefenderCount = 2
module.exports = {
  breed: function() {
    _spawnCreep(function() {
      _spawnDefender()
    })
  }
// }
  // specialOrder: function() {
  //   var buildingWithSpecialOrders = structures.findSpecialOrders('spawn', 'breed')
  //   if(buildingWithSpecialOrders) {
  //     var specialOrders = buildingWithSpecialOrders.memory.specialOrder
  //     var spawnToUse = structures.findAvailableSpawn()
  //     if(spawnToUse && _specialOrderIsValid(specialOrders)) {
  //       var bodyParts = specialOrders.templateName ? _baseCreeps[specialOrders.templateName].bodyParts : specialOrders.bodyParts
  //       if(_energyIsAvailableToBreed(bodyParts)) {
  //         if(typeof(spawnToUse.createCreep(bodyParts, {role: specialOrders.role, level: specialOrders.level})) == 'string') {
  //           console.log('Special breed order executed, deleting order')
  //           delete(buildingWithSpecialOrders.memory.specialOrders)
  //         } else {
  //           console.log('Failed to execute special breed order.  Spawn command didn\'t work')
  //         }
  //       } else {
  //         console.log('Failed to execute special breed order.  Not enough energy')
  //       }
  //     } else {
  //       console.log('Failed to execute special breed order.  No available spawn, or bad object')
  //     }
  //   }
  // }
}
/** ToDO:  Change this to allow for max creep per role, remove recursion
  *        and handle specifics for defender roles, possibly invader roles
  *        move defender code into _spawnCreep method.
**/
var _spawnCreep = function(callback, count) {
  var spawn = structures.findAvailableSpawn()
  if(spawn) {
    count = count ? count : 0
    var energy = _getAvailableSpawnEnergy()
    var roles = ['harvester', 'upgrader', 'builder']
    if(_getCreepCount(roles[count]) < maxCreepCount) {
      var creepTemplate = _getHighestLevelTemplate(energy)
      if(creepTemplate) {
        spawn.createCreep(creepTemplate.bodyParts, {role: roles[count], level: creepTemplate.level})
        return callback()
      } else {
        return callback()
      }
    }
    count++
    if(count < (roles.length)) {
      return _spawnCreep(callback, count)
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}

var _spawnDefender = function(spawn) {
  var spawn = structures.findAvailableSpawn()
  if(spawn) {
    var energy = _getAvailableSpawnEnergy()
    if(_getDefenderCount() < maxDefenderCount) {
      var creepTemplate = _getHighestLevelDefender(energy)
      if(creepTemplate) {
        _addToughnessToCreep(creepTemplate)
        return spawn.createCreep(creepTemplate.bodyParts, {role: 'defender', level: creepTemplate.level})
      } else {
        return
      }
    }
  } else {
    return
  }
}

var _getDefenderCount = function() {
  return _getCreepCount('defender')
}

var _getHighestLevelDefender = function(energy) {
  var highestAffordableTemplate = {price:0}
  var tempTemplate
  for(var template in _defenderCreeps) {
    tempTemplate = _defenderCreeps[template]
    if(tempTemplate.price <= energy && tempTemplate.price > highestAffordableTemplate.price) {
      highestAffordableTemplate = tempTemplate
    }
  }
  return highestAffordableTemplate
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

var _addToughnessToCreep = function(creepTemplate) {
  for(var i = 0; i < creepTemplate.toughness; i++) {
    creepTemplate.bodyParts.unshift(TOUGH)
  }
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

var _defenderCreeps = {
  levelZero: {
    level: 0,
    toughness: 10,
    bodyParts: [MOVE, MOVE, CARRY, ATTACK],
    price: 330
  },
  levelOne: {
    level: 1,
    toughness: 20,
    bodyParts: [MOVE, MOVE, CARRY, RANGED_ATTACK],
    price: 500
  },
  levelTwo: {
    level: 2,
    toughness: 30,
    bodyParts: [MOVE, MOVE, CARRY, ATTACK, ATTACK],
    price: 610
  },
  levelThree: {
    level: 3,
    toughness: 35,
    bodyParts: [MOVE, MOVE, CARRY, RANGED_ATTACK, RANGED_ATTACK],
    price: 800
  }
}
