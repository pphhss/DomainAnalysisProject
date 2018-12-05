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


module.exports = router;
