module.exports = {
  purge: function() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        console.log('💀', `[${name}] [${Memory.creeps[name].role}] [${Memory.creeps[name].roomName}]`)
        _removeDeadTowerTenders()
        if(Memory.sources) {
          _removeDeadHarvesters(name)
        }
        delete Memory.creeps[name]
      }
    }
  }
}

var _removeDeadTowerTenders = function() {
  for(var tower in Memory.towers) {
    if(Game.getObjectById(Memory.towers[tower]) == null) Memory.towers[tower] = false
  }
}

var _removeDeadHarvesters = function(creepName) {
  var sourcesFromMem = Memory.sources,
      tempIndex, tempSource
  for(var source in Memory.sources) {
    tempSource = Memory.sources[source]
    tempIndex = tempSource.harvesters.indexOf(creepName)
    if(tempIndex != -1) {
      tempSource.harvesters.splice(tempIndex, 1)
    }
  }
}
