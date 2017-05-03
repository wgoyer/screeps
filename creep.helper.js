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

  creepHasEnergy: function(creep) {
    return creep.memory && creep.memory.storage == 'full'
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

  findClosestDamagedCreep: function(requestor) {
    var filter = {filter: function(creep) { return creep.hits < creep.hitsMax }}
    return requestor.pos.findClosestByRange(FIND_MY_CREEPS, filter)
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
        'minCount': 0,
        'maxCount': 0,
        'priority': 3,
        'template': _defenderCreeps
      },
      'invader': {
        'name': 'invader',
        'minCount': 0,
        'maxCount': 3,
        'priority': 4,
        'template': _invaderCreeps
      },
      'claimer': {
        'name': 'claimer',
        'minCount': 0,
        'maxCount': 1,
        'priority': 5,
        'template': _claimerCreeps
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
    bodyParts: _addToughness([MOVE, CARRY, ATTACK, MOVE], 10),
    price: 330
  },
  levelOne: {
    level: 1,
    toughness: 20,
    bodyParts: _addToughness([MOVE, CARRY, RANGED_ATTACK, MOVE], 20),
    price: 500
  },
  levelTwo: {
    level: 2,
    toughness: 30,
    bodyParts: _addToughness([MOVE, CARRY, ATTACK, ATTACK, MOVE], 30),
    price: 610
  },
  levelThree: {
    level: 3,
    toughness: 35,
    bodyParts: _addToughness([MOVE, CARRY, RANGED_ATTACK, RANGED_ATTACK, MOVE], 35),
    price: 800
  }
}

var _invaderCreeps = {
  levelZero: {
    level: 0,
    toughness: 5,
    bodyParts: _addToughness([MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK]),
    preRequisite: {type: 'memory', key: 'spawnInvader', value: 'boolean'},
    price: 450
  }
}

var _claimerCreeps = {
  levelZero: {
    level: 0,
    toughness: 5,
    bodyParts: _addToughness([MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM], 5),
    preRequisite: {type: 'memory', key: 'spawnClaimer', value: 'boolean'},
    price: 850
  }
}
