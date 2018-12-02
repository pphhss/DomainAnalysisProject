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

DBmanager.prototype.login = function (id, pw, callback) {
  var query = "SELECT * FROM user WHERE id=" + this.pool.escape(id) + " AND pw=" + this.pool.escape(pw);
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;

    conn.query(query, function (err, results) {
      if (err)
        callback(err, null);
      else
        callback(null, results);
      conn.release();
    });


  });
};


DBmanager.prototype.getmaxsn = function (callback) {
  var query = "SELECT MAX(sn) FROM item";
  this.pool.getConnection(function (err, conn) {
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      callback(results[0]["MAX(sn)"]);
    });
  });
};

DBmanager.prototype.getmaxitemid = function (callback) {
  var query = "SELECT MAX(itemID) FROM itemdes";
  this.pool.getConnection(function (err, conn) {
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      callback(results[0]["MAX(itemID)"]);
    });
  });
}

DBmanager.prototype.recordItem = function (item,callback) {
  var query2 = "INSERT INTO item SET ?"
  var data2 = {
    "sn": item.sn,
    "status": item.status
  }
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;

    conn.query(query2, data2, function (err, results) {
      if (err)
        throw err;
      conn.release();
      callback();
    });
  });
}

DBmanager.prototype.recordItemDes_Item = function (itemID, item) {
  var query3 = "INSERT INTO itemdes_item SET ?"
  
  var data3 = {
    "itemID": itemID,
    "sn": item.sn,
    "borrowable": 1,
  }
  
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(query3, data3, function (err, results) {
      if (err)
        throw err;
      conn.release();
    });
  });
}

DBmanager.prototype.recordItemDes = function (itemdes, callback) {
  var query1 = "INSERT INTO itemdes SET ?"
 


  var data1 = {
    "itemID": itemdes.itemID,
    "category": itemdes.category,
    "keyword": itemdes.keyword,
    "name": itemdes.name,
    "leftQuan": itemdes.leftQuan,
    "deposit": itemdes.deposit,
    "lenderID": itemdes.lenderID,
    "policy": itemdes.policy,
    "term": itemdes.term,
    "location": itemdes.location,
    "rentalFee0": itemdes.rentalFee[0],
    "rentalFee1": itemdes.rentalFee[1],
    "rentalFee2": itemdes.rentalFee[2],
    "rentalFee3": itemdes.rentalFee[3],
    "rentalFee4": itemdes.rentalFee[4],
  };



  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;

    // record itemdes
    conn.query(query1, data1, function (err, results) {
      if (err)
        throw err;
      conn.release();
      callback();
    });

  });
}







exports.getInstance = function () {
  if (instance == null) {
    instance = new DBmanager();
    instance.init();
  }

  return instance;
}