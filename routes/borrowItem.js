var express = require('express');
var router = express.Router();

/* GET home page. */

/**
 *  if lender click registerItem.
 * 
 */
var rentalServiceHandler = require('../controllers/rentalServiceHandler').getInstance();
router.get('/', function (req, res, next) {
  if (req.session.user) {
    rentalServiceHandler.makeRentalService(req.session.user.id);
    res.render('layouts/layout', { body: "../borrowItem/borrowMain", title: "good", session: req.csession });
  }
  else
    res.send("<script>alert('not valid!');history.back();</script>")

});

router.get('/search', function (req, res) {
  //rentalServiceHandler.inputSearchInfo(req.query.category,req.query.keyword);

  console.log(req.query.category + "/" + req.query.keyword);
  var data = []

  data.push({
    "itemID": 1234,
    "name": "포카칩",
    "term": 10,
    "deposit": 50000,
    "avgRentalFee": 4000,
    "leftQuan": 10,
    "maxQuan": 20
  });

  res.send(JSON.stringify(data));
});


router.get('/inputSearchInfo', function (req, res) {
  var data = []
  rentalServiceHandler.inputSearchInfo(req.query.keyword, req.query.category, function (results) {
    for (var i = 0; i < results.length; i++)
      data.push({
        "itemID": results[i].itemID,
        "name": results[i].name,
        "term": results[i].term,
        "deposit": results[i].deposit,
        "avgRentalFee": (results[i].rentalFee0 + results[i].rentalFee1 + results[i].rentalFee2 + results[i].rentalFee3 + results[i].rentalFee4) / 5,
        "leftQuan": results[i].leftQuan,
        "maxQuan": results[i]["count(itemID)"]
      });
    res.send(JSON.stringify(data));
  });
});

router.get('/selectItem', function (req, res) {
  rentalServiceHandler.selectItem(req.session.user.id, Number(req.query.itemID), function (itemdes) {

    var lqbs = [0, 0, 0, 0, 0];
    for (var i = 0; i < itemdes.availList.length; i++)
      lqbs[itemdes.availList[i].status]++


    var info = {
      itemID: itemdes.itemID,
      name: itemdes.name,
      leftQuan: itemdes.leftQuan,
      deposit: itemdes.deposit,
      policy: itemdes.policy,
      term: itemdes.term,
      location: itemdes.location,
      rentalFee: itemdes.rentalFee,
      leftQuanByStatus: lqbs
    }
    res.render('layouts/layout', { info: info, body: "../borrowItem/selectItem", title: "good", session: req.csession });

  });

});

router.post('/inputRentalInfo', function (req, res) {
  rentalServiceHandler.inputRentalInfo(req.session.user.id, [Number(req.body.q0), Number(req.body.q1), Number(req.body.q2), Number(req.body.q3), Number(req.body.q4)], req.body.loc, Number(req.body.term), function (info) {
    res.render('layouts/layout', { info: info, body: "../borrowItem/acceptRental", title: "good", session: req.csession });
  });
});

router.get('/acceptRental',function(req,res){
  rentalServiceHandler.acceptRental(req.session.user.id, function(p){
    req.session.user.point = p;
    res.redirect("/");
  });
  
  
});

module.exports = router;
