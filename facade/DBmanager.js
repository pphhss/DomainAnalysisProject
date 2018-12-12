/**
 * DBmanager(singleton) - facade
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
/**
 *  method : login()
 * 
 *  handle user login.
 * 
 */
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

/**
 *  method : getmaxsn()
 *  
 *  return MAX serialnumber of item.
 */
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

/**
 *  method : getmaxitemid
 * 
 *  return MAX itemID of itemdescription
 */
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
/**
 *  method : recordItem
 * 
 *  register item into db
 * 
 */
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
/**
 * record data about item into DB
 * 
 */
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
/**
 *  method : getBorrowerPoint
 * 
 *  return borrower point.
 * 
 */

DBmanager.prototype.getBorrowerPoint = function (ID, callback) {
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
/**
 *  method : getmaxrentalid
 * 
 *  return MAX rentalID in DB
 */
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
/**
 *  method : getSearchInfo
 * 
 *  return results of search by keyword and category
 * 
 */
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
/**
 *  method : getItemInfo
 * 
 *  return itemdescription which has the itemID
 */
DBmanager.prototype.getItemInfo = function (itemID, callback) {
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
/**
 *  method : getItemDesList
 * 
 *  return list of list that represents item avaliable and used
 * 
 */
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

DBmanager.prototype.getItemList = function (sn, callback) {
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

DBmanager.prototype.updateItemBorrowable = function (sn) {
  var sql = "UPDATE itemdes_item SET borrowable=0 WHERE sn=" + sn;
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, function (err, results) {
      if (err)
        throw err;
      conn.release();
    });
  });
}

DBmanager.prototype.updateItemDesLeftQuan = function (itemID, lq) {
  var sql = "UPDATE itemdes SET leftQuan=" + lq + " WHERE itemID = " + itemID;
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, function (err, results) {
      if (err)
        throw err;
      conn.release();
    });
  });
}

DBmanager.prototype.recordRentalService = function (rs, callback) {
  var query = "SELECT MAX(rentalID) FROM rentalservice";
  var sql = "INSERT INTO rentalservice(rentalID,rentalFee,rentalTerm,borrowingLocation,datetime,borrowerID) VALUES ?"
  this.pool.getConnection(function (err, conn) {
    conn.query(query, function (err, results) {
      if (err)
        throw err;
      var values = [results[0]["MAX(rentalID)"] + 1, rs.rentalFee, rs.term, rs.borrowingLocation, null, rs.borrowerID];
      console.dir(values);
      conn.query(sql, [[values]], function (err, results) {
        if (err)
          throw err;
        conn.release();
      })
      callback(results[0]["MAX(rentalID)"]);
    });
  });
}
DBmanager.prototype.recordRentalItemList = function (rentalID, ril) {
  var values = [];
  var sql = "INSERT INTO rentalitemlist(rentalID,sn) VALUES ?"
  for (var i = 0; i < ril.list.length; i++)
    values.push([rentalID + 1, ril.list[i].sn]);

  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, [values], function (err, results) {
      if (err)
        throw err;
      conn.release();
    })
  });
}

DBmanager.prototype.recordBorrowerInfo = function (id, p) {
  console.log(id + "/" + p);
  var sql = "UPDATE user SET point = " + p + " WHERE id='" + id + "'"
  this.pool.getConnection(function (err, conn) {
    if (err)
      throw err;
    conn.query(sql, function (err, results) {
      if (err)
        throw err;
    })
  })
}
/*****************************ADMIN SECTION************************************** */
DBmanager.prototype.getAllItemDes = function(callback){
  var sql = "SELECT * FROM itemdes";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}

DBmanager.prototype.getAllItem = function(callback){
  var sql = "SELECT * FROM item";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}
DBmanager.prototype.getAllITI = function(callback){
  var sql = "SELECT * FROM itemdes_item";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}
DBmanager.prototype.getAllRS = function(callback){
  var sql = "SELECT * FROM rentalservice";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}
DBmanager.prototype.getAllRSL = function(callback){
  var sql = "SELECT * FROM rentalitemlist";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}
DBmanager.prototype.getAlluser = function(callback){
  var sql = "SELECT * FROM user";

  this.pool.getConnection(function(err,conn){
    if(err)
      throw err;
    conn.query(sql,function(err,results){
      if(err)
        throw err;
      callback(results);
    });
  })
}

/*****************************ADMIN SECTION************************************** */

exports.getInstance = function () {
  if (instance == null) {
    instance = new DBmanager();
    instance.init();
  }

  return instance;
}