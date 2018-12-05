
var DBmanager = require('../facade/DBmanager').getInstance();
var me = null;

function RentalService(borrowerID) {
  this.borrowerID = borrowerID;
  this.borrowerInfo = null;
  this.rentalID = 0;
  this.itemdes = null;
  me = this;


  DBmanager.getInfo(me.borrowerID, function (err, result) {
    if (err)
      throw err;
    me.borrowerInfo = require('./borrowerInfo').create(me.borrowerID, result.point)
    console.dir(me);
  });





}

RentalService.prototype.setRentalItem = function (itemID,callback) {

  DBmanager.getItemDes(itemID, function (itemdesinfo) {

    DBmanager.getItemDesList(itemID, function (availList, usedList) {

      itemdesinfo.availList = availList;
      itemdesinfo.usedList = usedList;
      me.itemdes = require('./itemDescription').recreate(itemdesinfo);
      
      // send itemdesinfo to UI
      setTimeout(() => {
        callback(me.itemdes);
      }, 500);

    })
  });
  
}



exports.create = function (borrowerID) {
  return new RentalService(borrowerID);
}