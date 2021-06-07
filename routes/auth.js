//LOGIN ENDPOINT  
const express   = require('express'),
    router      = express.Router(),
    bcrypt      = require('bcrypt'),
    _           = require('lodash'),
    Joi         = require('joi'),
    { User }    = require('../models/User');

// Configure dotenv dependancy to use credentials securely
require('dotenv').config();
// Parse json objects.
router.use(express.json());

// Login route (short profile)
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

// User register route.
router.post('/register' , async (req, res ) =>{
    // Check for valid user schema.
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    
    // Check for existing email.
    let newUser = await User.findOne( { email: req.body.email });
    if(newUser) return res.status(400).send("User already registered with this Email-ID");

    // Create user object with hashed password and store it to databaseō.
    newUser = new User(_.pick(req.body, ['first_name','last_name', 'email','password','user_role']));
    const salt = await bcrypt.genSalt(5);
    newUser.password = await bcrypt.hash(newUser.password, salt); 
    newUser = await newUser.save();

    // Generate auth token and send. // Instead send confimation mail and respond user to notify that
    // const token = newUser.genAuthToken();
    // res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'first_name','last_name', 'email']));
    
    // Async function to send mail.
    jwt.sign(
        {
            user: _.pick(newUser, 'id'),
        },
        process.env.WC_jwtPrivateKey,
        {
            expiresIn: '1d'
        },
        (err, emailToken) => {
            if(err)
                res.status(500).send({
                    message: "Failed to sign jwt token"
                });
            sendMail(newUser, emailToken);
        }
    );

    res.status(202).send({
        message: "Please verify your email by clicking on the link we just mailed you"
    });
});

// Email verification route.
router.get('/confirmation/:token', async (req, res)=>{
    try{
        const {user:{id}} = jwt.verify(req.params.token, process.env.WC_jwtPrivateKey);
        await User.updateOne({_id:id}, {$set:{confirmed: true}});
        res.redirect(`http://127.0.0.1:5000/users/${id}`);
    } catch(error){
        res.status(500).send({message: error});
    }
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