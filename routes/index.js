const searchAPI = require('./../api/searchAPI');
var express = require('express');
var router = express.Router();
<<<<<<< HEAD
const User = require("./../models/user")
=======
const User = require("../models/User");
>>>>>>> e7fb5104353135e256930ededa75b684ba788838

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// search
router.get('/search',searchAPI.searchName);
router.get('/searchRole',searchAPI.searchRole);

module.exports = router;
