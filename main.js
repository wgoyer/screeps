/** List of ToDos:
*   Fix issue where dumb ass builders are taking energy from spawn, then immediately depositing it
*   Fix issue where creeps aren't reloading the stupid towers
*   Fix issue with spawning more than max count for creeps that span multiple rooms
*   Fix issue with role.claimer and role.invader to use the same methods
*   Optimize harvesters to know how many creeps can use source at once - 4 - WIP
*   Remove dead codes, and clean up some stuffs - 1 - WIP
*   Change everything to parse all rooms - 4
*   Automatically remove claim flag when room is claimed - 2
*   Add special orders, add memory tokens so they can be switched on - 4
*   Add logic to extract minerals
*   Set up room links to transfer minerals between rooms
*   Logic to automatically take over adjacent rooms
*   After invaders are murdered, go collect their resources
*   Update creep templates to make more efficient creeps
*   Fix issue where every creep is idle all the time
**/

var spawner = require('spawn.creator')
var creepRunner = require('creep.runner')
var creepClean = require('creep.deathPanel')
var towerRunner = require('tower.runner')

module.exports.loop = function () {
  spawner.breed()
  towerRunner.run()
  creepRunner.run()
  creepClean.purge()
  checkForEnemies()
  hackFixRoleLessCreeps()
}

var checkForEnemies = function() {
  var invaders, invaderCount
  for(var room in Game.rooms) {
    invaders = Game.rooms[room].find(FIND_HOSTILE_CREEPS)
    if(invaders) {
      invaderCount = 0
      for(var creep in invaders) {
        invaderCount++
      }
      if(invaderCount > 0) console.log(`There are [${invaderCount}] invaders in [${room}]`)
    }
  }
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
