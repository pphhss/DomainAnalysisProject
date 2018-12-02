var DBmanager = require('../facade/DBmanager').getInstance();
function Item(status,sn){
  this.status = status;
  this.sn = sn;
  
}



exports.create = function(status,sn){
  return new Item(status,sn);
}