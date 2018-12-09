
var DBmanager = require('../facade/DBmanager').getInstance();
var me = null;
/**
 *  constructor : RentalService
 * 
 *  initialize instance.
 * 
 * 
 */
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


  //get borrowerPoint
  DBmanager.getBorrowerPoint(me.borrowerID, function (err, result) {
    if (err)
      throw err;
    // create borrower instance.
    me.borrowerInfo = require('./borrowerInfo').create(me.borrowerID, result.point)
    console.dir(me);
  });

}
/**
 *  method : setRentalItem
 * 
 *  create ItemDescription instance.
 * 
 * 
 */
RentalService.prototype.setRentalItem = function (itemID, callback) {

  //get IntemDescription information from DB.
  DBmanager.getItemInfo(itemID, function (itemdesinfo) {

    //get lists of Item instance in ItemDescription From DB 
    DBmanager.getItemDesList(itemID, function (availList, usedList) {

      itemdesinfo.availList = availList;
      itemdesinfo.usedList = usedList;
      
      //create ItemDescriontion instance.
      me.itemdes = require('./itemDescription').recreate(itemdesinfo);

      // send itemdesinfo to UI
      setTimeout(() => {
        callback(me.itemdes);
      }, 500);

    })
  });

}

/**
 *  method : payPoint
 * 
 *  if user accepts rentalservice, then system reduces borrower's point and adjust attribute of itemdescription
 * 
 */
RentalService.prototype.payPoint = function(callback){
  //get borrower's point
  var bp = this.borrowerInfo.getPoint()

  // set borrower's point
  this.borrowerInfo.setPoint(bp-this.rentalFee-this.itemdes.deposit)
  
  //update borrower's point into DB.
  this.borrowerInfo.updatePoint();

  // get itemlist from RentalItemList instance.
  var items = this.rentalItemList.getItems();

  // request ItemDescription instance to change its attribute that matches Item instances.
  this.itemdes.changeInfo(items);


  // record RentalService instance into DB.
  DBmanager.recordRentalService(me,function(rentalID){
    me.rentalID = rentalID;

    //record RentalServiceList into DB.
    DBmanager.recordRentalItemList(me.rentalID,me.rentalItemList)
  })

    callback(this.borrowerInfo.point)
  

}


/**
 *  method : setRentalInfo
 * 
 *  if user input rentalinfo ,for example location, term, quantities of status, then system adjusts attributes of RentalService instance
 * 
 */
RentalService.prototype.setRentalInfo = function (quans, location, term, callback) {

  // create RentalItemList instance.
  this.rentalItemList = require('./rentalItemList').create();
  
  // set borrowinglocation
  this.borrowingLocation = location;

  // get list of Item instances in ItemDescription instance that matches quantities of status.
  // set list of RentalItemList instance as the list from Itemdescription instance. 
  this.rentalItemList.setList(this.itemdes.getItems(quans));

  this.term = term;

  this.rentalFee = 0;
  
  // get list of rentalfee from ItemDescription instance.
  var rf = this.itemdes.getRentalFees();
  
  // get list of Status from Item instances in RentalItemList instance.
  var statuses = this.rentalItemList.getStatuses();
  

  // calculate total rentalFee.
  for (var i = 0; i < rf.length; i++)
    this.rentalFee = this.rentalFee + rf[i] * statuses[i]

  this.rentalFee = this.rentalFee * term;


  var info = {
    rentalFee: this.rentalFee,
    deposit: this.itemdes.deposit,
    term: this.term,

  }

  // send calcuted info to View layer.
  callback(info)


}

exports.create = function (borrowerID) {
  return new RentalService(borrowerID);
}