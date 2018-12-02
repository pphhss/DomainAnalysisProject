var itemcreator = require('./item');
var DBmanager = require('../facade/DBmanager').getInstance();

var me = null;

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
  me = this;

  DBmanager.getmaxsn(function (maxsn) {


    //create  item instance.
    for (var i = 0; i < data.statuses.length; i++)
      for (var j = 0; j < data.statuses[i]; j++) {

        maxsn++;
        me.availList.push(itemcreator.create(i, maxsn));
        (me.leftQuan)++;
      }

    for (var i = 0; i < data.rentalFee.length; i++) {
      me.rentalFee.push(data.rentalFee[i]);
    }

    //setting itemID
    DBmanager.getmaxitemid(function (maxitemID) {
      me.itemID = maxitemID + 1;

      // record  into DB
      var j = 0;
      DBmanager.recordItemDes(me, function () {
        for (var i = 0; i < me.availList.length; i++) {
          
          DBmanager.recordItem(me.availList[i], function () {

            DBmanager.recordItemDes_Item(me.itemID, me.availList[j++]);
          });
        }

      });
    })

  });



}



exports.create = function (lenderID, data) {
  return new itemDescription(lenderID, data);
}