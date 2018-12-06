
var DBmanager = require('../facade/DBmanager').getInstance();
var me = null;

function RentalService(borrowerID) {
  this.borrowerID = borrowerID;
  this.borrowerInfo = null;
  this.rentalID = 0;
  this.itemdes = null;
  this.rentalItemList = null;
  this.borrowingLocation = null;
  this.rentalFee = 0;
  this.term = 0;
  me = this;


  DBmanager.getInfo(me.borrowerID, function (err, result) {
    if (err)
      throw err;
    me.borrowerInfo = require('./borrowerInfo').create(me.borrowerID, result.point)
    console.dir(me);
  });





}

RentalService.prototype.setRentalItem = function (itemID, callback) {

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

RentalService.prototype.payPoint = function(){
  var bp = this.borrowerInfo.getPoint()

  this.borrowerInfo.setPoint(bp-this.rentalFee-this.itemdes.deposit)
  this.borrowerInfo.updatePoint();

  var items = this.rentalItemList.getItems();

  this.itemdes.changeInfo(items);

  DBmanager.recordRentalService(me,function(rentalID){
    me.rentalID = rentalID;

    DBmanager.recordRentalItemList(me.rentalID,me.rentalItemList)
  })

  

}

RentalService.prototype.setRentalInfo = function (quans, location, term, callback) {


  this.rentalItemList = require('./rentalItemList').create();
  this.borrowingLocation = location;
  this.rentalItemList.setList(this.itemdes.getItems(quans));

  this.term = term;

  this.rentalFee = 0;
  var rf = this.itemdes.getRentalFees();
  console.log("rf")
  console.dir(rf)
  var statuses = this.rentalItemList.getStatuses();
  console.log("st")
  console.dir(statuses)
  for (var i = 0; i < rf.length; i++)
    this.rentalFee = this.rentalFee + rf[i] * statuses[i]

  this.rentalFee = this.rentalFee * term;

  var info = {
    rentalFee: this.rentalFee,
    deposit: this.itemdes.deposit,
    term: this.term,

  }
  callback(info)


}

exports.create = function (borrowerID) {
  return new RentalService(borrowerID);
}