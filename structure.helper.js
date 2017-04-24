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
  }
}

var _getStructuresFromRoom = function(structureType) {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {filter:{structureType: structureType}})
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
