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

  getCreepsFromRoom: function(room) {
    return Game.rooms[room.name].find(FIND_MY_CREEPS)
  },

  getCreepCountFromRoomByRole: function(room, role) {
    var filter = {filter: function(creep) {return creep.memory.role == role}}
    return Game.rooms[room.name].find(FIND_MY_CREEPS, filter).length
  },

  getCreepCountFromWorldByRole: function(role) {
    var filter = {filter: function(creep) {return creep.memory.role == role}}
    var creepCount = 0
    for(var room in Game.rooms) {
      creepCount += Game.rooms[room].find(FIND_MY_CREEPS, filter).length
    }
    return creepCount
  },

  getCreepCountFromRoomBySubRole: function(room, role) {
    var filter = {filter: function(creep) {return creep.memory.subRole == role}}
    var creepsFoundBySubrole = room.find(FIND_MY_CREEPS, filter)
    return creepsFoundBySubrole.length
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
        'maxCount': 5,
        'maxLevel': 'room',
        'priority': 0,
        'template': _baseCreeps
      },
      'upgrader': {
        'name': 'upgrader',
        'minCount': 1,
        'maxCount': 2,
        'maxLevel': 'room',
        'priority': 1,
        'template': _baseCreeps
      },
      'builder': {
        'name': 'builder',
        'minCount': 1,
        'maxCount': 2,
        'maxLevel': 'room',
        'priority': 2,
        'template': _baseCreeps
      },
      'defender': {
        'name': 'defender',
        'minCount': 0,
        'maxCount': 0,
        'maxLevel': 'room',
        'priority': 3,
        'template': _defenderCreeps
      },
      'transporter': {
        'name': 'transporter',
        'minCount': 0,
        'maxCount': 3,
        'maxLevel': 'world',
        'priority': 4,
        'template': _transporterCreeps
      },
      'invader': {
        'name': 'invader',
        'minCount': 0,
        'maxCount': 2,
        'maxLevel': 'world',
        'priority': 4,
        'template': _invaderCreeps
      },
      'claimer': {
        'name': 'claimer',
        'minCount': 0,
        'maxCount': 1,
        'maxLevel': 'world',
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
    bodyParts: [WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY],
    price: 450
  },
  levelThree: {
    level: 3,
    bodyParts: [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
    price: 600
  },
  levelFour: {
    level: 4,
    bodyParts: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
    price: 800
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

var _transporterCreeps = {
  levelZero: {
    level: 0,
    toughness: 0,
    bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
    preRequisite: {type: 'flag', flagName: 'transport'},
    price: 500
  }
}

var _invaderCreeps = {
  levelZero: {
    level: 0,
    toughness: 0,
    bodyParts: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK],
    preRequisite: {type: 'flag', flagName: 'invade'},
    price: 700
  }
}

var _claimerCreeps = {
  levelZero: {
    level: 0,
    toughness: 5,
    bodyParts: _addToughness([MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM], 5),
    preRequisite: {type: 'flag', flagName: 'claim'},
    price: 850
  }
}
