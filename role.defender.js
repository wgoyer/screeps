var actions = require('creep.actions')
var roleDefender = {
  /** @param {Creep} creep **/
  run: function(creep) {
    var target = actions.getClosestTarget(creep)
    if(target) {
      actions.murder(creep, target)
    } else {
      actions.reloadTowers(creep)
    }
  }
}

module.exports = roleDefender;
