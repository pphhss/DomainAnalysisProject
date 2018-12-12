var express = require('express');
var router = express.Router();
var DBmanager = require('../facade/DBmanager').getInstance();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('admin/login');
});

router.post('/loginaction', function (req, res) {
  if (req.params.pw == 'tkd')
    res.send("error");
  else {
    req.session.admin = "admin";
    res.redirect('/admin/home');
  }
});
router.get('/home', function (req, res) {
  if (req.session.admin) {
    res.render('admin/home');
  } else
    res.redirect('/admin');
});

router.get('/itemdes', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAllItemDes(function(results){
      res.render('admin/itemdes',{results:results});
    });


    
  } else
    res.redirect('/admin');
});

router.get('/item', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAllItem(function(results){
      res.render('admin/item',{results:results});
    });


    
  } else
    res.redirect('/admin');
});

router.get('/iti', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAllITI(function(results){
      res.render('admin/iti',{results:results});
    });


    
  } else
    res.redirect('/admin');
});

router.get('/rs', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAllRS(function(results){
      res.render('admin/rs',{results:results});
    });


    
  } else
    res.redirect('/admin');
});


router.get('/rsl', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAllRSL(function(results){
      res.render('admin/rsl',{results:results});
    });


    
  } else
    res.redirect('/admin');
});


router.get('/user', function (req, res) {
  if (req.session.admin) {

    DBmanager.getAlluser(function(results){
      res.render('admin/user',{results:results});
    });


    
  } else
    res.redirect('/admin');
});
module.exports = router;
