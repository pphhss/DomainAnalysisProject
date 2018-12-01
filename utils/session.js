/**
 *  Manage client session.
 * 
 */
var session = function(req,res,next){
  var sending;
  if(req.session.user){
    sending = req.session.user.id;
    sending = JSON.stringify(sending);
  }else{
    sending="none"
  }
  req.csession = sending;
  next();
}

module.exports = session;