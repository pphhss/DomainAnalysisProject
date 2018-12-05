
var instance = null;

function RegisterItemHandler() {
  this.rsList = [];
}

RegisterItemHandler.prototype.makeRegisterItem = function (lenderID) {
  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == lenderID)
      this.rsList.splice(i, 1)
  this.rsList.push([lenderID, require('../models/registrationService').create()])

}

RegisterItemHandler.prototype.enterItemInfo = function (lenderID, data) {
  var rs = null;

  for (var i = 0; i < this.rsList.length; i++)
    if (this.rsList[i][0] == lenderID)
      rs = this.rsList[i][1];




  rs.setItemInfo(lenderID, data);

}





exports.getInstance = function () {
  if (instance == null)
    instance = new RegisterItemHandler();

  return instance;
}