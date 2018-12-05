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

DBmanager.prototype.recordItem = function (item, callback) {
  var query2 = "INSERT INTO item SET ?"
  console.log("ITEM" + item.sn)
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
  console.log("ITEMDESITEM" + item.sn)
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


DBmanager.prototype.getInfo = function (ID, callback) {
  var sql = "SELECT point FROM user WHERE id=" + this.pool.escape(ID);
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, function (err, results) {
      if (err)
        callback(err, null)
      else
        callback(null, results[0])
      conn.release();

    });
  });
}

DBmanager.prototype.getmaxrentalid = function (callback) {
  var query = "SELECT MAX(rentalID) FROM rentalservice";
  this.pool.getConnection(function (err, conn) {
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      callback(results[0]["MAX(rentalID)"]);
    });
  });
}

DBmanager.prototype.getSearchInfo = function (keyword, category, callback) {
  var query = "SELECT * FROM (SELECT itemID,name,term,deposit,rentalFee0,rentalFee1,rentalFee2,rentalFee3,rentalFee4,leftQuan FROM itemdes WHERE keyword LIKE '%" + keyword + "%' OR category LIKE '%" + category + "%') t1 INNER JOIN (SELECT itemID,count(itemID) FROM itemdes_item GROUP BY itemID) t2 ON t1.itemID = t2.itemID "

  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      callback(results);
    });
  });
}

DBmanager.prototype.getItemDes = function (itemID, callback) {
  var query = "SELECT * FROM itemdes WHERE itemID = " + itemID;
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      callback(results[0]);
    });
  })
}

DBmanager.prototype.getItemDesList = function (itemID, callback) {
  var avail = []
  var used = []
  var query = "SELECT * FROM itemdes_item WHERE itemID = " + itemID;
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      for (var i = 0; i < results.length; i++) {
        if (results[i].borrowable == 1)
          avail.push(results[i].sn);
        else
          used.push(results[i].sn);
      }
      conn.release();
      callback(avail, used);
    });
  });
}

DBmanager.prototype.getItemInfo = function (sn, callback) {
  var sql = "SELECT * FROM item WHERE sn=" + sn;
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, function (err, results) {
      if (err)
        throw err;
      conn.release();
      callback(results[0]);

    })
  })
}


exports.getInstance = function () {
  if (instance == null) {
    instance = new DBmanager();
    instance.init();
  }

  return instance;
}