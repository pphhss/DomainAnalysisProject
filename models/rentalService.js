
var DBmanger = require('../facade/DBmanager').getInstance();
var me = null;

function RentalService(borrowerID) {
  this.borrowerID = borrowerID;
  this.borrowerInfo = null;
  me = this;

  DBmanger.getInfo(borrowerID,function(err,result){
    if(err)
      throw err;
    me.borrowerInfo = require('./borrowerInfo').create(borrowerID,result.point)
    console.dir(me);
  });

}







exports.create = function (borrowerID) {
  return new RentalService(borrowerID);
}