var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layouts/layout', { body:"../index",title: "good",session: req.csession });
});

module.exports = router;
