

var instance = null;

function ItemList(){

}




exports.getInstance = function(){
  if(instance==null)
    instance = new ItemList()
  return instance;
}