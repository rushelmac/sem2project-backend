//REGISTER ENDPOINT
const express   = require('express'),
    _           = require('lodash'),
    router      = express.Router(),
    jwt         = require('jsonwebtoken'),
    fileupload  = require('express-fileupload'),
    { User, validateUser, validateParams } = require('../models/User');


    router.get('/', (req, res) => {
        res.json({
            message: "Works fine bro"
        });
    }); 
    
module.exports = router;