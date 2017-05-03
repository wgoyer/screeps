var sHelper = require('structure.helper')
var rHelper = require('room.helper')

module.exports = {
  /** @param {Creep} creep **/
  harvest: function(creep) {
    _say(creep, '⛏ harvest')
    _headToEnergySourceAndHarvest(creep)
  },

  deposit: function(creep) {
    _say(creep, '💰 deposit')
    _newHeadToDepositTargetAndDepositEnergy(creep)
  },

  upgrade: function(creep) {
    _say(creep, '✔ upgrade')
    _headToUpgradeTargetAndUpgrade(creep)
  },

  build: function(creep, target) {
    _say(creep, '🏗 build')
    _headToBuildTargetAndBuild(creep, target)
  },

  murder: function(creep) {
    _say(creep, 'MURDER')
    _headToEnemyAndAttack(creep)
  },

  getClosestEnemyTarget: function(creep) {
    return _getEnemyTarget(creep)
  },

  reloadTowers: function(creep) {
    _reloadTower(creep)
  },

  withdrawEnergy: function(creep) {
    _withdrawEnergyFromBank(creep)
  }
}

var _reloadTower = function(creep) {
  var tower = creep.memory['tendingTower'] ? Game.getObjectById(creep.memory.tendingTower) : sHelper.findNeedyTower(creep)
  if(tower) {
    if(creep.memory['storage'] == 'full') {
      _headToTowerAndDepositEnergy(creep, tower)
    } else {
      _withdrawEnergyFromBank(creep)
    }
  }
}

var _headToEnemyAndAttack = function(creep) {
  var target = creep.memory['target'] || _getEnemyTarget(creep)
  if(target) {
    creep.memory['target'] = target
    var attackResults = creep.attack(target)
    if(attackResults == ERR_NOT_IN_RANGE) creep.moveTo(target)
    if(attackResults == ERR_INVALID_TARGET) delete(creep.memory['target'])
  }
}

var _getEnemyTarget = function(creep) {
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
    bank = sHelper.findClosestEnergyToWithdraw(creep)
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

var _newHeadToDepositTargetAndDepositEnergy = function(creep) {
  var depository = _getDepositTarget(creep)
  if(depository) {
    var transferResults
    if(depository.structureType != 'tower') {
      transferResults = creep.transfer(depository, RESOURCE_ENERGY)
      if(transferResults == ERR_NOT_IN_RANGE) creep.moveTo(depository, {visualizePathStyle: {stroke: '#ffffff'}})
      if(creep.carry.energy == 0) {
        _say(creep, '✔ deposit complete')
        creep.memory['storage'] = 'empty'
      }
    } else {
      _reloadTower(creep)
    }
  }
}

var _getDepositTarget = function(creep) {
  if(creep.memory['tendingTower']) return Game.getObjectById(creep.memory.tendingTower)
  var energyDepo,
      structs,
      room = rHelper.getRoomFromCreep(creep)

  structs = sHelper.findBaseStructuresThatNeedEnergy(room)
  if(structs.length > 0) return creep.pos.findClosestByPath(structs)

  structs = sHelper.findNeedyTower(creep)
  if(structs) return structs

  structs = sHelper.findContainersThatNeedEnergy(room)
  if(structs.length > 0) return creep.pos.findClosestByPath(structs)
}
// ToDo:  Break this up
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
  if(transferResults == ERR_FULL) {
    delete(creep.memory.tendingTower)
    Memory.towers[tower.id] = false
    if(creep.carry.energy > 0) _headToDepositTargetAndDepositEnergy(creep)
  }
  if(creep.carry.energy == 0) {
    _say(creep, '✔ deposit complete')
    delete(creep.memory.tendingTower)
    Memory.towers[tower.id] = false
    creep.memory['storage'] = 'empty'
  }
}

var _headToUpgradeTargetAndUpgrade = function(creep) {
  creep.memory.upgrading = true
  var upgradeResults = creep.upgradeController(creep.room.controller)
  if(upgradeResults == ERR_NOT_IN_RANGE) creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
  if(upgradeResults == ERR_NOT_ENOUGH_RESOURCES) {
    _say(creep, '📉 no NRG')
    creep.memory['storage'] = 'empty'
    creep.memory.upgrading = false
  }
}

var _headToBuildTargetAndBuild = function(creep, buildTarget) {
  if(!buildTarget) return
  creep.memory.building = true
  var buildResults = creep.build(buildTarget)
  if(buildResults == ERR_NOT_IN_RANGE) creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}})
  if(buildResults == ERR_NOT_ENOUGH_RESOURCES) {
    _say(creep, '📉 no NRG')
    creep.memory.storage = 'empty'
    creep.memory.building = false
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
