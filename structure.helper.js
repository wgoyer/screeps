var roomName = 'W5N8'
module.exports = {
  findBuildTarget: function() {
    return Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES)[0] || null
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
      return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, containersWithEnergy)
    } else {
      var spawnFilter = {filter: function(structure) {
        return structure.structureType == STRUCTURE_SPAWN && structure.energy > creep.carryCapacity
      }}
      return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, spawnFilter)
    }
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

var _getAvailableSpawns = function() {
  return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: function(structure){
      return !structure.spawning && structure.structureType == 'spawn'
    }
  })
}

// Game.rooms['sim'].find(FIND_MY_STRUCTURES, function(structure) {structure.energy < structure.energyCapacity})
// Game.rooms['sim'].find(FIND_MY_STRUCTURES, function(structure) {structure.energy && structure.energyCapacity && structure.energy < structure.energyCapacity})
//
// Game.rooms['sim'].find(FIND_MY_STRUCTURES, {
//   filter: function(structure) {
//     return structure.energy < structure.energyCapacity
//   }
// })

/** Structure Types
    STRUCTURE_SPAWN: "spawn",
    STRUCTURE_EXTENSION: "extension",
    STRUCTURE_ROAD: "road",
    STRUCTURE_WALL: "constructedWall",
    STRUCTURE_RAMPART: "rampart",
    STRUCTURE_KEEPER_LAIR: "keeperLair",
    STRUCTURE_PORTAL: "portal",
    STRUCTURE_CONTROLLER: "controller",
    STRUCTURE_LINK: "link",
    STRUCTURE_STORAGE: "storage",
    STRUCTURE_TOWER: "tower",
    STRUCTURE_OBSERVER: "observer",
    STRUCTURE_POWER_BANK: "powerBank",
    STRUCTURE_POWER_SPAWN: "powerSpawn",
    STRUCTURE_EXTRACTOR: "extractor",
    STRUCTURE_LAB: "lab",
    STRUCTURE_TERMINAL: "terminal",
    STRUCTURE_CONTAINER: "container",
    STRUCTURE_NUKER: "nuker"
**/
