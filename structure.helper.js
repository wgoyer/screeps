var rHelper = require('room.helper')
var roomName = 'W5N8'
module.exports = {

  findAvailableSpawn: function() {
    return _getAvailableSpawns()[0] || null
  },

  newFindAvailableSpawns: function() {
    return _newGetAvailableSpawns()
  },

  // ToDo:  Fix this to handle just MY structures, which means roads and walls have to be included separately
  findClosestDamagedStructure: function(requestor) {
    var filter = {filter: function(structure) { return structure.hits < structure.hitsMax }}
    return requestor.pos.findClosestByRange(FIND_STRUCTURES, filter)
  },

  findTowers: function() {
    return _getMyStructuresFromRooms('tower')
  },

  findBaseStructuresThatNeedEnergy: function(room) {
    var energyTargetsFilter = {filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity}
    }
    return room.find(FIND_MY_STRUCTURES, energyTargetsFilter)
  },

  findContainersThatNeedEnergy: function(room) {
    return _getContainersWithAvailableCapacity(room)
  },

  findNeedyTower: function(creep) {
    var room = rHelper.getRoomFromCreep(creep)
    var towers = _getTowersThatNeedEnergy(room)
    if(towers) {
      if(!Memory['towers']) Memory['towers'] = {}
      for(var i = 0; i < towers.length; i++) {
        if(!Memory.towers[towers[i].id]) {
          creep.memory['tendingTower'] = towers[i].id
          Memory['towers'][towers[i].id] = creep.id
          return towers[i]
        }
      }
    }
  },

  findClosestEnergyToWithdraw: function(creep) {
    var containersWithEnergy = _getContainersWithEnergy(creep)
    if(containersWithEnergy.length > 0) {
      return creep.pos.findClosestByPath(containersWithEnergy)
    } else {
      var spawnFilter = {filter: function(structure) {
        return structure.structureType == STRUCTURE_SPAWN && structure.energy > creep.carryCapacity
      }}
      return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, spawnFilter)
    }
  },

  findClosestConstructionSite: function(creep) {
    var allConstructionStructures = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
    return creep.pos.findClosestByPath(allConstructionStructures)
  }
}

var _getMyStructuresFromRooms = function(structureType) {
  var filter = {filter: {structureType: structureType}}
  var returnStructures = [],
      tempStructures = []
  for(var room in Game.rooms) {
    tempStructures = Game.rooms[room].find(FIND_MY_STRUCTURES, filter)
    returnStructures = returnStructures.length > 0 ? returnStructures.concat(tempStructures) : tempStructures
  }
  return returnStructures
}

var _getContainersWithEnergy = function(creep) {
  var containerFilter = {filter: function(structure) {
    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > creep.carryCapacity
  }}
  return creep.room.find(FIND_MY_STRUCTURES, containerFilter)
}

var _getStructuresWithAvailableEnergyCapacity = function() {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: function(structure) {
      return structure.energy < structure.energyCapacity
    }
  })
}

var _getStructuresWithAvailableEnergyForWithdraw = function() {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: function(structure) {
      return structure.energy > 50
    }
  })
}

var _getStructuresWithRoomForEnergy = function(room) {
  var energyStructuresFilter = {filter: function(structure) {
    return (structureType == STRUCTURE_SPAWN || structureType == STRUCTURE_EXTENSION || structureType == STRUCTURE_TOWER) && structure.energyCapacity > structure.energy
  }}
  var energyStructures = room.find(FIND_MY_STRUCTURES, energyStructuresFilter)
  if(energyStructures) return energyStructures

  var storageStructuresFilter = {filter: function(structure) {
    return (structureType == STRUCTURE_CONTAINER || STRUCTURE_STORAGE) && structure.storeCapacity > structure.store.energy
  }}
  return room.find(FIND_MY_STRUCTURES, storageStructuresFilter)
}

var _getContainersWithAvailableCapacity = function(room) {
  var containerTargetsFilter = {filter: (structure) => {
    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity}
  }
  return room.find(FIND_MY_STRUCTURES, containerTargetsFilter)
}

var _getTowersThatNeedEnergy = function(room) {
  var filter = { filter: function(structure) {
    return structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity - 50)
  }}
  return room.find(FIND_MY_STRUCTURES, filter)
}

var _getAvailableSpawns = function() {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: function(structure){
      return !structure.spawning && structure.structureType == 'spawn'
    }
  })
}

var _newGetAvailableSpawns = function() {
  var spawns = Game.spawns,
      availableSpawns = []
  for(var spawn in spawns) {
    if(!Game.spawns[spawn].spawning) availableSpawns.push(Game.spawns[spawn])
  }
  return availableSpawns
}

var _getAllAvailableSpawns = function() {
  var spawns = []
  for(var spawn in Game.spawns) {
    if(!spawn.spawning) spawns.push(spawn)
  }
  return spawns
}
