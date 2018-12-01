var express = require('express');
var router = express.Router();

/* GET home page. */

/**
 *  if lender click registerItem.
 * 
 */
router.get('/registerItem', function (req, res, next) {
  if (req.session.user) {
    var registerItemHandler = require('../controllers/registerItemHandler').getInstance();
    registerItemHandler.makeRegisterItem(req.session.user.id);

    res.render('layouts/layout', { body:"../rentalStore/registerItem",title: "good",session: req.csession });
  }
  else
    res.send("<script>alert('not valid!');history.back();</script>")
});


router.post('/enterItemInfo',function(req,res){
  var params = req.body
  var data = {
    "name":params.name,
    "category":params.category,
    "keyword":params.keyword,
    "deposit":Number(params.deposit),
    "policy":params.policy,
    "term": Number(params.term),
    "location":params.location,
    "statuses":[Number(params.s0),Number(params.s1),Number(params.s2),Number(params.s3),Number(params.s4)]
  };

});

module.exports = router;
