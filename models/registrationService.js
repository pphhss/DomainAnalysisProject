

function RegistrationService(){
  this.itemdes = null;
  
}

RegistrationService.prototype.setItemInfo = function(lenderID,data){
  this.itemdes = require('./itemDescription').create(lenderID,data);
  console.dir(this.itemdes);
}




exports.create = function(){
  return new RegistrationService();
}