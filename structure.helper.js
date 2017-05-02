var roomName = 'W5N8'
module.exports = {

  findBuildTarget: function() {
    return Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES)[0] || null
  },

  findEnergyDepository: function() {
    return _getStructuresWithAvailableEnergyCapacity()[0] || null
  },

  findEnergyToWithdraw: function() {
    return _getStructuresWithAvailableEnergyForWithdraw()[0] || null
  },

  findAvailableSpawn: function() {
    return _getAvailableSpawns()[0] || null
  },

  findTowers: function() {
    return _getStructuresFromRoom('tower')
  },

  findNeedyTower: function(creep) {
    var filter = {
      filter: function(structure) {
        return structure.structureType == STRUCTURE_TOWER &&
          structure.energy < structure.energyCapacity
      }
    }
    var towers = _getStructuresFromRoom('tower')
    return creep.pos.findClosestByPath(towers, filter)
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
  },

  /** @param {structureType} structureType **/
  findSpecialOrders: function(structureType, orderType) {
    var filter = {
      filter: function(structure) {
        return structure.structureType == structureType &&
          structure.memory &&
          structure.memory.specialOrder &&
          structure.memory.specialOrder.type == orderType
      }
    }
    return Game.rooms[roomName].find(FIND_MY_STRUCTURES, filter)[0] || null
  }
}

var _getStructuresFromRoom = function(structureType) {
  var filter = {filter: {structureType: structureType}}
  return Game.rooms[roomName].find(FIND_STRUCTURES, filter)
}

var _getContainersWithEnergy = function(creep) {
  var containerFilter = {filter: function(structure) {
    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > creep.carryCapacity
  }}
  return creep.room.find(FIND_MY_STRUCTURES, containerFilter)
}

var _getMyStructuresFromRoom = function(structureType) {
  var filter = {filter: {structureType: structureType}}
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, filter)
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

var _getAvailableSpawns = function() {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: function(structure){
      return !structure.spawning && structure.structureType == 'spawn'
    }
  })
}
