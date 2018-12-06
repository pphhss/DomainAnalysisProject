


function RentalItemList(){
  this.list = [];
}


RentalItemList.prototype.setList = function(itemList){
  this.list = itemList;
}

RentalItemList.prototype.getStatuses = function(){
  var slist = [0,0,0,0,0]

  for(var i=0;i<this.list.length;i++)
    slist[this.list[i].status]++;
  return slist;
}

RentalItemList.prototype.getItems = function(){
  return this.list
}



exports.create = function(){
  return new RentalItemList();
}