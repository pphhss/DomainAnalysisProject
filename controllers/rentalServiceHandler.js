/**
 * RentalServiceHandler
 * 
 * this class is reposible for system operation.
 * this class is Singleton
 */
var instance = null


var DBmanager = require('../facade/DBmanager').getInstance();

function RentalServiceHandler() {
  this.rsList = []
}
/**\
 *  method : makeRentalService
 * 
 *  make RentalService instance.
 */
RentalServiceHandler.prototype.makeRentalService = function (borrowID) {
  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID) // if there is same id in rsList(borrower re-access system), System delete previous instance.
      this.rsList.splice(i, 1); 
  this.rsList.push([borrowID, require('../models/rentalService').create(borrowID)]); // push rs into list
}

RentalServiceHandler.prototype.inputSearchInfo = function (keyword, category, callback) {

  DBmanager.getSearchInfo(keyword, category, function (results) {
    callback(results);
  });

}


RentalServiceHandler.prototype.selectItem = function (borrowID, itemID, callback) {
  var rs = null;

  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID)
      rs = this.rsList[i][1];




  rs.setRentalItem(itemID, callback);

}



RentalServiceHandler.prototype.inputRentalInfo = function (borrowID, quans, location, term, callback) {
  var rs = null;

  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID)
      rs = this.rsList[i][1];
  rs.setRentalInfo(quans, location, term, callback);
}

RentalServiceHandler.prototype.acceptRental = function (borrowID) {
  var rs = null;

  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == borrowID)
      rs = this.rsList[i][1];
  rs.payPoint();
}



exports.getInstance = function () {
  if (instance == null)
    instance = new RentalServiceHandler();
  return instance;
}