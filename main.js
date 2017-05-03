var roomName = 'W5N8'

var spawner = require('spawn.creator')
var creepRunner = require('creep.runner')
var creepClean = require('creep.deathPanel')
var towerRunner = require('tower.runner')

module.exports.loop = function () {
  spawner.breed()
  // spawner.specialOrder();
  towerRunner.run()
  creepRunner.run()
  creepClean.purge()
  checkForEnemies()
  hackFixRoleLessCreeps()
}

var checkForEnemies = function() {
  var invaders = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS)
  var count = 0
  for(var creep in invaders) {
    count++
  }
  if(count > 0) console.log(`THERE ARE ${count} INVADERS IN THE ROOM`)

}

var hackFixRoleLessCreeps = function() {
  for(var creep in Game.creeps) {
    if(!Game.creeps[creep].memory) {
      console.log(`${creep.name} has no memory.`)
      Game.creeps[creep].memory = {'role': 'harvester'}
    }
    if(!Game.creeps[creep].memory.role) {
      console.log(`${creep.name} has no role.`)
      Game.creeps[creep].memory['role'] = 'harvester'
    }
  }
}
