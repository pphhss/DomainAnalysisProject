/**
 * DBmanager(singleton)
 * 
 * 
 */
var config = require('../config');
var mysql = require('mysql');

instance = null;

function DBmanager() {
  this.pool = null;
}

/**
 * init() : initialize DBmanager object.
 */
DBmanager.prototype.init = function () {
  this.pool = mysql.createPool({
    connectionLimit: config.db.connectionLimit,
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    dateStrings: 'date'
  });
};

DBmanager.prototype.login = function(id,pw,callback){
  var query = "SELECT * FROM user WHERE id="+this.pool.escape(id)+" AND pw="+this.pool.escape(pw);
  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    
    conn.query(query,function(err,results){
      if(err)
        callback(err,null);
      else
        callback(null,results);
      conn.release();
    });
    
    
  });
};


DBmanager.prototype.getmaxsn = function(callback){
  var query = "SELECT MAX(sn) FROM item";
  this.pool.getConnection(function(err,conn){
    conn.query(query,function(err,results){
      if(err)
        throw err;
      callback(results[0]["MAX(sn)"]);  
    });
  });
};

DBmanager.prototype.getmaxitemid = function(callback){
  var query = "SELECT MAX(itemID) FROM itemdes";
  this.pool.getConnection(function(err,conn){
    conn.query(query,function(err,results){
      if(err)
        throw err;
      callback(results[0]["MAX(itemID)"]);  
    });
  });
}

DBmanager.prototype.registerItemDes = function(callback){
  var query = ""
}







exports.getInstance = function () {
  if (instance == null){
    instance = new DBmanager();
    instance.init();
  }
    
  return instance;
}