module.exports = {
  run: function(creep) {
    var controller = Game.getObjectById('d9cf0772ccaa764')
    if(creep.claimController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller)
  }
}
