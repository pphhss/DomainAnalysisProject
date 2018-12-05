
var instance = null

var ItemList = require('../models/itemList').getInstance();
var DBmanager = require('../facade/DBmanager').getInstance();

function RentalServiceHandler() {
  this.rsList = []
}

RentalServiceHandler.prototype.makeRentalService = function (borrowID) {
  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID)
       this.rsList.splice(i,1);
  this.rsList.push([borrowID, require('../models/rentalService').create(borrowID)]);
}

RentalServiceHandler.prototype.inputSearchInfo = function (keyword, category, callback) {

  DBmanager.getSearchInfo(keyword, category, function (results) {
    callback(results);
  });

}


RentalServiceHandler.prototype.selectItem = function (borrowID, itemID,callback) {
  var rs = null;

  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID)
      rs = this.rsList[i][1];




  rs.setRentalItem(itemID,callback);

}









exports.getInstance = function () {
  if (instance == null)
    instance = new RentalServiceHandler();
  return instance;
}