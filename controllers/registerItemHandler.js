
var instance = null;

function RegisterItemHandler(){
  this.rsList = [];
}

RegisterItemHandler.prototype.makeRegisterItem = function(lenderID){
  this.rsList.push(lenderID,require('../models/registrationService').create())
  console.dir(this.rsList);
}

RegisterItemHandler.prototype.enterItemInfo = function(lenderID,data){
  
}





exports.getInstance = function(){
  if(instance==null)
    instance = new RegisterItemHandler();

  return instance;
}