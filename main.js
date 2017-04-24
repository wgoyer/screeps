var spawner = require('spawn.creator');
var creepRunner = require('creep.runner');
var creepClean = require('creep.deathPanel');

module.exports.loop = function () {
  spawner.breed();
  creepRunner.run();
  creepClean.purge();



    // var tower = Game.getObjectById('05c895bddb70a9e195730476');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }
    //
    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }
    //
    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
    //     if(creep.memory.role == 'harvester') {
    //         roleHarvester.run(creep);
    //     }
    //     if(creep.memory.role == 'upgrader') {
    //         roleUpgrader.run(creep);
    //     }
    //     if(creep.memory.role == 'builder') {
    //         roleBuilder.run(creep);
    //     }
    // }
}
