/** List of ToDos:
*   Fix issue with new flags causing errors - 2 - done
*   Remove dead codes, and clean up some stuffs - 1 - WIP
*   Fix Issue with dead creeps being assigned as tower tenders - 2 - done
*   Change everything to parse all rooms - 4
*   Change harvesters to find new source if one is exhausted - 2
*   Optimize harvesters to know how many creeps can use source at once - 4
*   Modify pre-requisites for invasion and claiming to look for flag - 3 - WIP
*   Modify invaders to choose a new role when entering room with flag - 3 - done
*   Automatically remove claim flag when room is claimed - 2
*   Handle multiple room spawns - 4
*   Add special orders, add memory tokens so they can be switched on - 4
*   Add logic to extract minerals
*   Set up room links to transfer minerals between rooms
*   Logic to automatically take over adjacent rooms
*   After invaders are murdered, go collect their resources
*   Update creep templates to make more efficient creeps
**/
var roomName = 'W5N8'

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
