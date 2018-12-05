
var DBmanager = require('../facade/DBmanager').getInstance();
var instance = null;

function ItemList(){
  this.itemList = [];
}

ItemList.prototype.makeItemDescription = function(borrowerID,keyword,category){
  
  this.itemList.push([borrowID, ]);
}


exports.getInstance = function(){
  if(instance==null)
    instance = new ItemList()
  return instance;
}