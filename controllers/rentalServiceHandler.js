
var instance = null


function RentalServiceHandler(){
  this.rsList = []
}

RentalServiceHandler.prototype.makeRentalService = function(borrowID){
  this.rsList.push([borrowID,require('../models/rentalService').create(borrowID)]);
}









exports.getInstance = function(){
  if(instance==null)
    instance = new RentalServiceHandler();
  return instance;
}