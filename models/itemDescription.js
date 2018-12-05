var itemcreator = require('./item');
var DBmanager = require('../facade/DBmanager').getInstance();



function ItemDescription(data) {
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
  this.lenderID = 0;






}


exports.recreate = function (data) {
  var item = new ItemDescription(data);


  item.rentalFee.push(data.rentalFee0)
  item.rentalFee.push(data.rentalFee1)
  item.rentalFee.push(data.rentalFee2)
  item.rentalFee.push(data.rentalFee3)
  item.rentalFee.push(data.rentalFee4)
  item.itemID = data.itemID;
  item.leftQuan = data.leftQuan;
  item.lenderID = data.lenderID;

  for (var i = 0; i < data.availList.length; i++) {
    var j = i;
    DBmanager.getItemInfo(data.availList[j], function (info) {
      item.availList.push(itemcreator.create(info.status, info.sn));
    });
  }

  for (var i = 0; i < data.usedList.length; i++) {
    var j = i;
    DBmanager.getItemInfo(data.usedList[j], function (info) {
      item.usedList.push(itemcreator(info.status, info.sn))
    });
  }



  return item;
}

exports.createFirst = function (lenderID, data) {
  var itemdes = new ItemDescription(data);

  itemdes.lenderID = lenderID
  DBmanager.getmaxsn(function (maxsn) {


    //create  item instance.
    for (var i = 0; i < data.statuses.length; i++)
      for (var j = 0; j < data.statuses[i]; j++) {

        maxsn++;
        itemdes.availList.push(itemcreator.create(i, maxsn));
        (itemdes.leftQuan)++;
      }

    for (var i = 0; i < data.rentalFee.length; i++) {
      itemdes.rentalFee.push(data.rentalFee[i]);
    }

    //setting itemID
    DBmanager.getmaxitemid(function (maxitemID) {
      itemdes.itemID = maxitemID + 1;

      // record  into DB
      var j = 0;
      DBmanager.recordItemDes(itemdes, function () {
        for (var i = 0; i < itemdes.availList.length; i++) {

          DBmanager.recordItem(itemdes.availList[i], function () {
            setTimeout(() => {
              DBmanager.recordItemDes_Item(itemdes.itemID, itemdes.availList[j++]);
            }, 80);

          });
        }

      });
    })

  });
  return itemdes;
}