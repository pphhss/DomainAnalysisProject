/**
 *  Manage client session.
 * 
 */
var session = function(req,res,next){
  var sending={};
  if(req.session.user){
    sending.id = req.session.user.id;
    sending.point = req.session.user.point;
    
  }else{
    sending="none"
  }
  req.csession = sending;
  next();
}

module.exports = session;