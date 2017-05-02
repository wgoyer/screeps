var structures = require('structure.helper')

module.exports = {
  /** @param {Creep} creep **/
  harvest: function(creep) {
    _say(creep, '⛏ harvest')
    _headToEnergySourceAndHarvest(creep)
  },
  deposit: function(creep) {
    _say(creep, '💰 deposit')
    _headToDepositTargetAndDepositEnergy(creep)
  },
  upgrade: function(creep) {
    _say(creep, '✔ upgrade')
    _headToUpgradeTargetAndUpgrade(creep)
  },
  build: function(creep) {
    _say(creep, '🏗 build')
    _headToBuildTargetAndBuild(creep)
  },
  murder: function(creep) {
    _say(creep, 'MURDER')
    _headToEnemyAndAttack(creep)
  },
  getClosestTarget: function(creep) {
    return _getTarget(creep)
  },
  reloadTowers: function(creep) {
    _reloadTower(creep)
  }
}

var _reloadTower = function(creep) {
  var tower = structures.findNeedyTower(creep)
  if(tower) {
    _say(creep, 'reload')
    if(creep.memory['storage'] == 'full') {
      _headToTowerAndDepositEnergy(creep, tower)
    } else {
      _withdrawEnergyFromBank(creep)
    }
  }
}

var _headToEnemyAndAttack = function(creep) {
  var target = creep.memory['target'] || _getTarget(creep)
  if(target) {
    creep.memory['target'] = target
    var attackResults = creep.attack(target)
    if(attackResults == ERR_NOT_IN_RANGE) creep.moveTo(target)
    if(attackResults == ERR_INVALID_TARGET) delete(creep.memory['target'])
  }
}

var _getTarget = function(creep) {
  if(creep.memory['target']) {
    return creep.memory.target
  } else {
    var closestHostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if(closestHostileCreep) {
      creep.memory['target'] = closestHostileCreep
      return closestHostileCreep
    } else {
      return null
    }
  }
}

var _withdrawEnergyFromBank = function(creep) {
  var bank
  if(creep.memory['bank']) {
    bank = Game.getObjectById(creep.memory['bank'])
  } else {
    bank = structures.findClosestEnergyToWithdraw(creep)
  }
  if(bank) creep.memory['bank'] = bank.id
  var withdrawResults = creep.withdraw(bank, RESOURCE_ENERGY)
  if(withdrawResults == ERR_NOT_IN_RANGE) creep.moveTo(bank)
  if(withdrawResults == ERR_NOT_ENOUGH_RESOURCES) delete(creep.memory.bank)
  if(creep.carryCapacity == creep.carry.energy) {
    creep.memory['storage'] = 'full'
    delete(creep.memory.bank)
  }
}

var _headToEnergySourceAndHarvest = function(creep) {
  if(creep.carryCapacity > creep.carry.energy) {
    _getAvailableSource(creep, function(source) {
      var harvestResults
      if(source) {
        creep.memory['source'] = source.id
        harvestResults = creep.harvest(source)
        if(harvestResults == ERR_NOT_IN_RANGE) creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
      } else {
        _headToHangout(creep)
      }
    })
  } else {
    _say(creep, '🔋 full')
    creep.memory['storage'] = 'full';
    delete(creep.memory['source']);
  }
}

var _headToDepositTargetAndDepositEnergy = function(creep) {
  var energyTargetsFilter = {filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity}
  }

  var energyTargets = creep.room.find(FIND_MY_STRUCTURES, energyTargetsFilter)
  var closestEnergyRepo = creep.pos.findClosestByPath(energyTargets)

  var targetToUse
  if(closestEnergyRepo) {
    targetToUse = closestEnergyRepo
  } else {
    var containerTargetsFilter = {filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity}
    }
    var containerTargets = creep.room.find(FIND_MY_STRUCTURES, containerTargetsFilter)
    if(containerTargets) {
      var containerTarget = creep.pos.findClosestByPath(containerTargets)
      targetToUse = containerTarget
    } else {
      return _headToHangout(creep)
    }
  }
  var transferResult = creep.transfer(targetToUse, RESOURCE_ENERGY)
  if(transferResult == ERR_NOT_IN_RANGE) creep.moveTo(targetToUse, {visualizePathStyle: {stroke: '#ffffff'}})
  if(creep.carry.energy == 0) {
    _say(creep, '✔ deposit complete')
    creep.memory['storage'] = 'empty'
  }

}

var _headToTowerAndDepositEnergy = function(creep, tower) {
  var transferResults = creep.transfer(tower, RESOURCE_ENERGY)
  if(transferResults == ERR_NOT_IN_RANGE) creep.moveTo(tower, {visualizePathStyle: {stroke: '#eeeeee'}})
  if(transferResults == ERR_FULL && creep.carry.energy > 0) _headToDepositTargetAndDepositEnergy(creep)
  if(creep.carry.energy == 0) {
    _say(creep, '✔ deposit complete')
    creep.memory['storage'] = 'empty'
  }
}

var _headToUpgradeTargetAndUpgrade = function(creep) {
  creep.memory.upgrading = true
  var upgradeResults = creep.upgradeController(creep.room.controller)
  if(upgradeResults == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
  if(upgradeResults == ERR_NOT_ENOUGH_RESOURCES) {
    _say(creep, '📉 need NRG')
    creep.memory['storage'] = 'empty'
    creep.memory.upgrading = false
  }
}

var _headToBuildTargetAndBuild = function(creep) {
  var target = creep.room.find(FIND_CONSTRUCTION_SITES) ? creep.room.find(FIND_CONSTRUCTION_SITES)[0] : null
  if(target) {
    creep.memory.building = true
    var buildResults = creep.build(target)
    if(buildResults == ERR_NOT_IN_RANGE) creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
    if(buildResults == ERR_NOT_ENOUGH_RESOURCES) {
      _say(creep, '📉 need NRG')
      creep.memory.storage = 'empty'
      creep.memory.building = false
    }
  } else {
    _headToHangout(creep)
  }
}

var _headToHangout = function(creep) {
  var role = creep.memory.role;
  creep.memory['idle'] = true
  var flags = Game.flags
  for(var flag in flags) {
    if(Game.flags[flag].memory.roles.indexOf(role) > -1) {
      creep.moveTo(Game.flags[flag], {visualizePathStyle: {stroke: '#f4e842'}})
    }
  }
}

var _getAvailableSource = function(creep, callback) {
  var excludeSources = []
  if(creep.memory['source']) {
    return callback(Game.getObjectById(creep.memory.source))
  } else {
    var roomSources = creep.room.find(FIND_SOURCES, {
      filter: function(source) {
        if(excludeSources.indexOf(source.id) == -1) {
          return source
        }
      }
    })
    var creeps = _getCreeps();
    _findAvailableSource(creeps, roomSources, 0, function(source) {
      if(source) {
        return callback(source)
      } else {
        return callback()
      }
    })
  }
}

var _findAvailableSource = function(creeps, roomSources, count, callback) {
  var sourceUseCount = 0;
  var currentSource = roomSources[count]
  for(var i = 0; i < creeps.length; i++) {
    if(creeps[i].memory['source'] && creeps[i].memory.source == currentSource.id) {
      sourceUseCount++;
    }
  }

  if(sourceUseCount < 4) {
    return callback(currentSource)
  } else {
    if(count >= (roomSources.length - 1)) {
      return callback();
    } else {
      count++;
      _findAvailableSource(creeps, roomSources, count, callback);
    }
  }
}

var _say = function(creep, message) {
  var lastMessage = creep.memory['lastMessage'] ? creep.memory.lastMessage : false
  if(lastMessage != message) {
    creep.memory['lastMessage'] = message
    creep.say(message)
  }
}

var _getCreeps = function() {
  var creeps = [];
  for(var creep in Game.creeps) {
    creeps.push(Game.creeps[creep])
  }
  return creeps
}
