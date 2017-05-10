module.exports = {

  getRoomFromCreep: function(creep) {
    if(creep) return _getRoomFromCreep(creep)
  },

  getRoomFromSpawn: function(spawn) {
    if(spawn) return Game.rooms[spawn.room.name]
  },

  getRoomAvailableSpawnEnergy: function(room) {
    if(room) return room.energyAvailable
  },

  roomHasEnergyCapacity: function(room) {
    if(room) return _roomHasEnergyCapacity(room)
  },

  roomHasWithdrawableEnergy: function(creep) {
    if(creep) {
      var room = _getRoomFromCreep(creep)
      return _roomHasWithdrawableEnergy(room) > creep.carryCapacity
    }
  },

  roomNeedsSpawnEnergy: function(room) {
    if(room) return room.energyCapacityAvailable > room.energyAvailable
  },

  getRoomSources: function(room) {
    if(!Memory.sources) Memory.sources = {}
    if(room) {
      var sourcesInRoom = Game.rooms[room.name].find(FIND_SOURCES_ACTIVE)
      _addSourcesToMemory(sourcesInRoom, room)
      return sourcesInRoom
    }
  },

  setRoomSourcesMaxUtilization: function(room) {
    // x: 10, y: 22
    // above: y+1
    // below: y-1
    // left x-1
    // right x+1
    // check left and right of position
    // increment y by one and check position, and left and right
    // decrement y by two and check position, and left and right
  },

  getRoomNames: function() {
    var rooms = []
    for(var room in Game.rooms) {
      rooms.push(room.name)
    }
    if(rooms.length == 1) return rooms[0]
    return rooms
  }
}

var _roomHasEnergyCapacity = function(room) {
  if(room.storage){
    var storageTotal = _.sum(room.storage.store)
    return room.energyCapacityAvailable > room.energyAvailable || room.storage.storeCapacity > storageTotal
  } else {
    return room.energyCapacityAvailable > room.energyAvailable
  }
}

var _addSourcesToMemory = function(sources, room) {
  if(sources) {
    for(var i = 0; i < sources.length; i++) {
      if(!Memory.sources[sources[i].id]) {
        Memory.sources[sources[i].id] = {room: room.name, harvesters: [], maxUtil: 3}
      }
    }
  }
}

var _determineMaxUtilizationOfSource = function(sourceID) {
  var source = Game.getObjectById(sourceID)

}

var _roomHasWithdrawableEnergy = function(room) {
  if(room.storage) {
    var storageTotal = _.sum(room.storage.store)
    if(room.storage.store.energy && room.storage.store.energy > 0) return room.storage.store.energy
  }
  if(room.energyAvailable > 0) return room.energyAvailable

}

var _getRoomFromCreep = function(creep) {
  return Game.rooms[creep.room.name]
}
