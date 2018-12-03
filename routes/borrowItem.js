var express = require('express');
var router = express.Router();

/* GET home page. */

/**
 *  if lender click registerItem.
 * 
 */
router.get('/', function (req, res, next) {
  var rentalServiceHandler = require('../controllers/rentalServiceHandler').getInstance();
  rentalServiceHandler.makeRentalService(req.session.user.id);
  res.render('layouts/layout', { body: "../borrowItem/borrowMain", title: "good", session: req.csession });

});

router.get('/search', function (req, res) {
  console.log(req.query.category + "/" + req.query.keyword);
  var data = []

  data.push({
    "itemID": 1234,
    "name": "망고",
    "term": 10,
    "deposit": 50000,
    "avgRentalFee": 4000,
    "leftQuan": 10,
    "maxQuan": 20
  });

  res.send(JSON.stringify(data));
});



module.exports = router;
