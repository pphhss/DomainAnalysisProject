
var instance = null;

function RegisterItemHandler(){
  this.rsList = [];
}

RegisterItemHandler.prototype.makeRegisterItem = function(lenderID){
  this.rsList.push([lenderID,require('../models/registrationService').create()])
  console.dir(this.rsList);
}

RegisterItemHandler.prototype.enterItemInfo = function(lenderID,data){
  var rs = null;

  for (var i=0; i<this.rsList.length;i++)
    if(this.rsList[i][0]==lenderID)
      rs = this.rsList[i][1];
  
  
  
  console.dir("rs : "+rs);
  rs.setItemInfo(lenderID,data);
  
}
  




exports.getInstance = function(){
  if(instance==null)
    instance = new RegisterItemHandler();

  return instance;
}