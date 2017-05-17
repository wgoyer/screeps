module.exports = {
  StructureLink.prototype.run = function() {
    const flagOnLink = this.room.lookForAt(LOOK_FLAGS, this.pos)
    if(flagOnLink && flagOnLink.name == 'from') {
      const allFlags = this.room.lookFor(LOOK_FLAGS)
      for(var flag in allFlags) {
        if(flag.name == 'to') {
          const linkUnderToFlag = flag.room.lookForAt(LOOK_STRUCTURES, flag.pos))
          if(linkUnderToFlag && linkUnderToFlag.energy < linkUnderToFlag.energyCapacity) {
            this.transferEnergy(linkUnderToFlag)
          }
        }
      }
    }
  }
}
