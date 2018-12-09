var itemcreator = require('./item');
var DBmanager = require('../facade/DBmanager').getInstance();


/**
 *  Constructor : ItemDescription
 * 
 * 
 * 
 */
function ItemDescription(data) {
  this.name = data.name;
  this.category = data.category;
  this.keyword = data.keyword;
  this.deposit = data.deposit;
  this.policy = data.policy;
  this.term = data.term;
  this.location = data.location;
  //rentalFee is list that has rentalFees by statues
  this.rentalFee = [];

  // availList is list that has borrowable Item instances 
  this.availList = [];

  // usedList is list that has non-borrowable Item instance.
  this.usedList = [];
  this.itemID = 0;
  this.leftQuan = 0;
  this.lenderID = 0;

}

/**
 *  method : getItem
 * 
 *  return list of item instances that matches the status in availList.
 * 
 */
ItemDescription.prototype.getItems = function (quans) {
  var itemList = [];
  var k = 0
  for (var i = 0; i < quans.length; i++) {
    for (var j = 0; j < this.availList.length; j++) {
      if (this.availList[j].status == i) {
        itemList.push(this.availList[j])
        k++;
        if (k == quans[i])
          break;
      }

    }
    k = 0;

  }
  return itemList;
}

ItemDescription.prototype.getRentalFees = function () {
  return this.rentalFee
}

/**
 * method : changeInfo
 * 
 *  move Item instances from avaliList to userList
 * 
 *  record changed information into DB
 * 
 */
ItemDescription.prototype.changeInfo = function (items) {
  for (var i = 0; i < items.length; i++)
    for (var j = 0; j < this.availList.length; j++)
      if (this.availList[j] == items[i]) {
        this.availList.splice(j, 1); //remove Item instance.
        this.usedList.push(items[i]); // add Item instance.
        DBmanager.updateItemBorrowable(items[i].sn) // recordItem함수의 일부분
      }
  
  this.leftQuan = this.leftQuan - items.length;
  DBmanager.updateItemDesLeftQuan(this.itemID,this.leftQuan)// recordItem함수의 일부분
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
    DBmanager.getItemList(data.availList[j], function (info) {
      item.availList.push(itemcreator.create(info.status, info.sn));
    });
  }

  for (var i = 0; i < data.usedList.length; i++) {
    var j = i;
    DBmanager.getItemList(data.usedList[j], function (info) {
      item.usedList.push(itemcreator.create(info.status, info.sn))
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
            }, 100);

          });
        }

      });
    })

  });
  return itemdes;
}