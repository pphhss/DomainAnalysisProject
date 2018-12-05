
var instance = null

var ItemList = require('../models/itemList').getInstance();
var DBmanager = require('../facade/DBmanager').getInstance();

function RentalServiceHandler() {
  this.rsList = []
}

RentalServiceHandler.prototype.makeRentalService = function (borrowID) {
  this.rsList.push([borrowID, require('../models/rentalService').create(borrowID)]);
}

RentalServiceHandler.prototype.inputSearchInfo = function (keyword, category,callback) {

  DBmanager.getSearchInfo(keyword,category,function(results){
    callback(results);
  });
  
}








exports.getInstance = function () {
  if (instance == null)
    instance = new RentalServiceHandler();
  return instance;
}