
var instance = null;

function RegisterItemHandler(){
  this.rsList = [];
}

RegisterItemHandler.prototype.makeRegisterItem = function(lenderID){
  this.rsList.addRegistrationService(lenderID,require('../models/registrationService').create())
  console.dir(this.rsList);
}






exports.getInstance = function(){
  if(instance==null)
    instance = new RegisterItemHandler();

  return instance;
}