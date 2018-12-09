

function RegistrationService(){
  this.itemdes = null;
  
}

/**
 *  method : setItemInfo
 * 
 *  if lender input item info, then system sets attributes of instances. 
 * 
 */
RegistrationService.prototype.setItemInfo = function(lenderID,data){
  // create ItemDescription instance.
  this.itemdes = require('./itemDescription').createFirst(lenderID,data);
}




exports.create = function(){
  return new RegistrationService();
}