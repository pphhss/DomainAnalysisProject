

var instance = null;

function SessionManager(){
  this.registerList=[];
}

function Element(id,rs){
  this.id = id;
  this.rs = rs;
}

SessionManager.prototype.addRegistrationService = function(lenderID,rs){
  this.registerList.push(new Element(lenderID,rs));

}




exports.getInstance = function(){
  if(instance==null)
    instance =  new SessionManager()

  return instance;

}