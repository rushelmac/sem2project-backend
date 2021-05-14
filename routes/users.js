//REGISTER ENDPOINT
const express   = require('express'),
    bcrypt      = require('bcrypt'),
    _           = require('lodash'),
    router      = express.Router(),
    jwt         = require('jsonwebtoken'),
    sendMail    = require("../controllers/verify-mail"),
    { User, validateUser, validateParams } = require('../models/user-model');

// Allowing the application to read jwt's in the form of json
router.use(express.json());    
// For importing jwt private key
require('dotenv').config();

// Route to get all users: Tested, Works fine
router.get('/', async (req, res) => {
    const users = await User.find().sort('first_name');
    res.send(users);
});

// Route to get a specific user by id. Tested, Works fine
router.get('/:id', async (req, res) => {
    const { error } = validateParams(req.params);
    if(error) return res.status(400).send(error.details[0].message);

    const found = await User.findById(req.params.id);
    if(!found) return res.status(404).send('User not found with given ID');
    res.send(found);
});

// User register route.
router.post('/' , async (req, res ) =>{
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

// Update user profile route.
router.put('/:id', async (req, res) =>{
    let { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const paramCheck = validateParams(req.params);
    if(paramCheck.error) return res.status(400).send(paramCheck.error.details[0].message);

    const found = await User.findByIdAndUpdate(req.params.id,_.pick(req.body, ['first_name','last_name','email','password']), {new:true});

    if(!found) return res.status(404).send('User not found with given ID');

    res.send(found);
});

// Delete user.
router.delete('/:id', async (req, res) => {
    
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const found = await User.findByIdAndRemove(req.params.id);

    if(!found) return res.status(404).send('User not found with given ID');
    
    res.send(found);
});

// temp login route
router.get("/login", async (req, res)=>{
    res.send("you've successfully logged in");
});


module.exports = router;

