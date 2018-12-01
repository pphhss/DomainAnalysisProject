var DBmanager = require('../facade/DBmanager').getInstance();
function Item(status){
  this.status = status;
  this.sn = 0;
  DBmanager.getmaxsn(function(maxsn){
    this.sn = maxsn+1;
  });
}



exports.create = function(status){
  return new Item(status);
}