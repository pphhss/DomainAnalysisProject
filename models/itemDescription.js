var itemcreator = require('./item');
var DBmanager = require('../facade/DBmanager').getInstance();

function itemDescription(lenderID, data) {
  this.name = data.name;
  this.category = data.category;
  this.keyword = data.keyword;
  this.deposit = data.deposit;
  this.policy = data.policy;
  this.term = data.term;
  this.location = data.location;
  this.rentalFee = [];
  this.availList = [];
  this.usedList = [];
  this.itemID = 0;
  this.leftQuan = 0;
  this.lenderID = lenderID;

  for (var i = 0; i < data.statuses.length; i++)
    for (var j = 0; j < data.statuses[i]; j++){
      this.availList.push(itemcreator.create(i));
      (this.leftQuan)++;
    }
  
  for (var i=0;i<data.rentalFee.length;i++){
    this.rentalFee.push(data.rentalFee[i]);
  }

  DBmanager.getmaxitemid(function(maxitemID){
    this.itemID = maxitemID + 1;
  })
}



exports.create = function(lenderID,data){
  return new itemDescription(lenderID,data);
}