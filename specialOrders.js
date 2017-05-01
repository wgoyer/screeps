/**
* Copy and paste commands to create special orders for structures
**/

Game.spawns['Spawn1'].memory['specialOrder'] = {type: 'breed', templateName: levelThree, role: 'harvester', level: 3}
Game.spawns['Spawn1'].memory['specialOrder'] = {type: 'breed', bodyParts: [WORK, MOVE, CARRY, CARRY, CARRY], role: 'harvester', level: 4}

// specialOrder: function() {
//   var buildingWithSpecialOrders = structures.findSpecialOrders('spawn', 'breed')
//   if(buildingWithSpecialOrders) {
//     var specialOrders = buildingWithSpecialOrders.memory.specialOrder
//     var spawnToUse = structures.findAvailableSpawn()
//     if(spawnToUse && _specialOrderIsValid(specialOrders)) {
//       var bodyParts = specialOrders.templateName ? _baseCreeps[specialOrders.templateName].bodyParts : specialOrders.bodyParts
//       if(_energyIsAvailableToBreed(bodyParts)) {
//         if(typeof(spawnToUse.createCreep(bodyParts, {role: specialOrders.role, level: specialOrders.level})) == 'string') {
//           console.log('Special breed order executed, deleting order')
//           delete(buildingWithSpecialOrders.memory.specialOrders)
//         } else {
//           console.log('Failed to execute special breed order.  Spawn command didn\'t work')
//         }
//       } else {
//         console.log('Failed to execute special breed order.  Not enough energy')
//       }
//     } else {
//       console.log('Failed to execute special breed order.  No available spawn, or bad object')
//     }
//   }
// }

var _specialOrderIsValid = function(specialOrder) {
  if((specialOrder.template || specialOrder.bodyParts) && (specialOrder.role && specialOrder.level)) {
    return true
  }
  console.log('Bad order object should be: {template: templateName || bodyParts: [PARTS], role: roleName, level: #}')
  return false
}
