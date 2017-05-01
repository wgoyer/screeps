module.exports = {
  getRoomNames: function() {
    var rooms = []
    for(var room in Game.rooms) {
      rooms.push(room.name)
    }
    if(rooms.length == 1) return rooms[0]
    return rooms
  }
}
