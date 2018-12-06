var DBmanager = require('../facade/DBmanager').getInstance();

function BorrowerInfo(borrowerID,point){
  this.borrowerID = borrowerID
  this.point = point
}

BorrowerInfo.prototype.getPoint = function(){
  return this.point
}
BorrowerInfo.prototype.setPoint = function(p){
  this.point = p
}
BorrowerInfo.prototype.updatePoint = function(){
  console.log(this.borrowerID+"/"+this.point);
  DBmanager.updatePoint(this.borrowerID,this.point);
}
exports.create = function(borrowerID,point){
  return new BorrowerInfo(borrowerID,point);
}