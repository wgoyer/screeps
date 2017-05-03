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
  var storageTotal = _.sum(room.storage.store)
  return room.energyCapacityAvailable > room.energyAvailable || room.storage.storeCapacity > storageTotal
}

var _roomHasWithdrawableEnergy = function(room) {
  var storageTotal = _.sum(room.storage.store)
  if(room.storage.store.energy && room.storage.store.energy > 0) return room.storage.store.energy
  if(room.energyAvailable > 0) return room.energyAvailable
}

var _getRoomFromCreep = function(creep) {
  return Game.rooms[creep.room.name]
}
