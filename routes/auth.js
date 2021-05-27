//LOGIN ENDPOINT  
const express   = require('express'),
    router      = express.Router(),
    bcrypt      = require('bcrypt'),
    _           = require('lodash'),
    Joi         = require('joi'),
    { User }    = require('../models/user');

// Configure dotenv dependancy to use credentials securely
require('dotenv').config();
// Parse json objects.
router.use(express.json());

// Create user. (short profile)
router.post('/' , async (req, res ) =>{
    
    const { error } = validateAuth(req.body);
    if(error) return res.status(400).send('Invalid Email or Password'); 
    
    let newUser = await User.findOne( { email: req.body.email });
    if(!newUser) return res.status(400).send('Invalid Email or Password');
    if(!newUser.confirmed) return res.status(400).send('Please Verify Your Email');

    const validPass = await bcrypt.compare(req.body.password, newUser.password);
    if(!validPass) return res.status(400).send('Invalid Email or Password'); 
    
    const token = newUser.genAuthToken();    
    res.send(token);
});

// Validate user attribute limits
function validateAuth(req){

    const schema = Joi.object({
        email : Joi.string().min(10).max(255).required().email(),
        password : Joi.string().min(8).max(1024).required()
    });
    return schema.validate(req);
}

module.exports = router;