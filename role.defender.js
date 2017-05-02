var actions = require('creep.actions')
var roleDefender = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var target = actions.getClosestEnemyTarget(creep)
    if(target) {
      actions.murder(creep, target)
    } else {
      actions.reloadTowers(creep)
    }
  }
}

module.exports = roleDefender;
