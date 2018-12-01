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

router.post('/registeraction', function (req, res) {

});

module.exports = router;
