

function BorrowerInfo(borrowerID,point){
  this.borrowerID = borrowerID
  this.point = point
}



exports.create = function(borrowerID,point){
  return new BorrowerInfo(borrowerID,point);
}