module.exports = {
  getCreeps: function() {
    var creeps = []
    for(var creep in Game.creeps) {
      creeps.push(Game.creeps[creep])
    }
    if(creeps.length > 0) {
      return creeps
    } else {
      return null
    }
  },

  getCreepCount: function(creepRole) {
    var creepCount = 0
    for(var creep in Game.creeps) {
      if(Game.creeps[creep].memory.role == creepRole) {
        creepCount++
      }
    }
    return creepCount
  },

  getRoles: function() {
    return {
      'harvester': {
        'name': 'harvester',
        'minCount': 3,
        'maxCount': 6,
        'priority': 0,
        'template': _baseCreeps
      },
      'upgrader': {
        'name': 'upgrader',
        'minCount': 2,
        'maxCount': 3,
        'priority': 1,
        'template': _baseCreeps
      },
      'builder': {
        'name': 'builder',
        'minCount': 2,
        'maxCount': 4,
        'priority': 2,
        'template': _baseCreeps
      },
      'defender': {
        'name': 'defender',
        'minCount': 1,
        'maxCount': 2,
        'priority': 3,
        'template': _defenderCreeps
      }
    }
  }
}

var _addToughness = function(parts, amount) {
  for(var i = 0; i < amount; i++) {
    parts.unshift(TOUGH)
  }
  return parts
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
    bodyParts: _addToughness([MOVE, MOVE, CARRY, ATTACK], 10),
    price: 330
  },
  levelOne: {
    level: 1,
    toughness: 20,
    bodyParts: _addToughness([MOVE, MOVE, CARRY, RANGED_ATTACK], 20),
    price: 500
  },
  levelTwo: {
    level: 2,
    toughness: 30,
    bodyParts: _addToughness([MOVE, MOVE, CARRY, ATTACK, ATTACK], 30),
    price: 610
  },
  levelThree: {
    level: 3,
    toughness: 35,
    bodyParts: _addToughness([MOVE, MOVE, CARRY, RANGED_ATTACK, RANGED_ATTACK], 35),
    price: 800
  }
}
