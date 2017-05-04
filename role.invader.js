var actions = require('creep.actions')
var cHelper = require('creep.helper')
var rHelper = require('room.helper')
var roleBuilder = require('role.builder')
var roleUpgrader = require('role.upgrader')

module.exports = {
  run: function(creep) {
    var invaderStatus = creep.memory['invading'],
        invaderSubRole = creep.memory['subRole']

    if(invaderSubRole) return _runSubRole(creep, invaderSubRole)
    if(invaderStatus != 'done') return actions.invade(creep)
    if(invaderStatus == 'done' && !invaderSubRole) return _assignSubRole(creep)
  }
}

var _assignSubRole = function(creep) {
  var room = rHelper.getRoomFromCreep(creep),
      upgradeRoleCount = cHelper.getCreepCountFromRoomBySubRole(room, 'upgrader'),
      builderRoleCount = cHelper.getCreepCountFromRoomBySubRole(room, 'builder'),
      subRoleToUse = upgradeRoleCount < builderRoleCount ? 'upgrader' : 'builder'

      console.log('upgradeRoleCount: ' + upgradeRoleCount)
      console.log('builderRoleCount: ' + builderRoleCount)

  creep.memory['subRole'] = subRoleToUse
  return _runSubRole(creep, subRoleToUse)
}

var _runSubRole = function(creep, subRole) {
  if(subRole == 'builder') roleBuilder.runInvader(creep)
  if(subRole == 'upgrader') roleUpgrader.runInvader(creep)
}
