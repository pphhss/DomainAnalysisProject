


var instance = null;

function LoginHandler(){

}


LoginHandler.prototype.acceptLogin = function(id,pw,callback){
  var DBmanager = require('../facade/DBmanager').getInstance();
  DBmanager.login(id,pw,function(err,results){
    if(err)
      throw err;
    console.dir(results);
    if(results.length==0)
      callback(null)
    else
      callback(results[0])
  });
}





exports.getInstance = function(){
  if(instance==null)
    instance = new LoginHandler();
  return instance;
}





