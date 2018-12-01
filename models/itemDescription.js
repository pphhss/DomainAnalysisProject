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
  this.availList = [];
  this.usedList = [];
  this.itemID = 0;

  for (var i = 0; i < data.statuses.length; i++)
    for (var j = 0; j < data.statuses[i]; j++)
      this.availList.push(itemcreator.create(i));

  DBmanager.getmaxitemid(function(maxitemID){
    this.itemID = maxitemID + 1;
  })
}