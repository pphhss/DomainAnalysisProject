
var DBmanger = require('../facade/DBmanager').getInstance();
var me = null;

function RentalService(borrowerID) {
  this.borrowerID = borrowerID;
  this.borrowerInfo = null;
  this.rentalID = 0;
  me = this;


  DBmanger.getInfo(me.borrowerID, function (err, result) {
    if (err)
      throw err;
    me.borrowerInfo = require('./borrowerInfo').create(me.borrowerID, result.point)
    console.dir(me);
  });





}





exports.create = function (borrowerID) {
  return new RentalService(borrowerID);
}