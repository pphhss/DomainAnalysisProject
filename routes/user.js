var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/loginaction', function (req, res, next) {


  var loginHandler = require('../controllers/loginHandler').getInstance();

  loginHandler.acceptLogin(req.body.id, req.body.pw, function (result) {
    console.log(result)
    if (result == null)
      res.send("<script>alert('not valid!');history.back();</script>");
    else {
      req.session.user = result;
      res.redirect('/');
    }
  });






});

module.exports = router;