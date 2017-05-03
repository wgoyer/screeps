module.exports = {
  purge: function() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name]
        console.log('☠ rip - ', name)
        _removeDeadTowerTenders()
      }
    }
  }
}

var _removeDeadTowerTenders = function() {
  for(var tower in Memory.towers) {
    if(Game.getObjectById(Memory.towers[tower]) == null) Memory.towers[tower] = false
  }
}
