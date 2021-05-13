const searchAPI = require('./../api/searchAPI');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// search by name
router.get('/search/:name', searchAPI().searchName)

module.exports = router;
