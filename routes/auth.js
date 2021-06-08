//LOGIN ENDPOINT  
const express   = require('express'),
    router      = express.Router(),
    bcrypt      = require('bcrypt'),
    _           = require('lodash'),
    Joi         = require('joi'),
    sendMail    = require("../controllers/verify-mail"),
    jwt         = require('jsonwebtoken'),
    { User, validateUser, validateParams}    = require('../models/User');

// Configure dotenv dependancy to use credentials securely
require('dotenv').config();
// Parse json objects.
router.use(express.json());
// #### Tested: Works fine
// Login route (short profile)
router.post('/' , async (req, res ) =>{
    
    // const { error } = validateAuth(req.body);
    // if(error) return res.status(400).send('Invalid Email or Password'); 
    
    let newUser = await User.findOne( { "credentials.email": req.body.email });
    if(!newUser) return res.status(400).send('Invalid Email or Password');
    if(!newUser.credentials.confirmed) return res.status(400).send('Please Verify Your Email');

    const validPass = await bcrypt.compare(req.body.password, newUser.credentials.password);
    if(!validPass) return res.status(400).send('Invalid Email or Password'); 
    
    const token = newUser.genAuthToken();    
    res.send(token);
});
// 
// User register route.
router.post('/register' , async (req, res ) => {
    // Check for valid user schema.
    // const { error } = validateUser(req.body);
    // if(error) return res.status(400).send(error.details[0].message); 
    
    // Check for existing email.
    let newUser = await User.findOne( { "credentials.email": req.body.email });
    if(newUser) return res.status(400).send("User already registered with this Email-ID");

    // Create user object with hashed password and store it to databaseō.
    const UserObj = {
        credentials : {
            email : req.body.email
        },
        info : {
            first_name:req.body.first_name, 
            last_name:req.body.last_name, 
            user_role: req.body.user_role, 
            current_post:req.body.current_post, 
            current_organization: req.body.current_organization
        }
    };

    try{

        newUser = new User(UserObj);
        const salt = await bcrypt.genSalt(5);
        newUser.credentials.password = await bcrypt.hash(req.body.password, salt);
        newUser = await newUser.save();
    }catch(e){ console.log(e)}

    // Async function to send mail.
    jwt.sign(
        {
            user: _.pick(newUser, 'id'),
        },
        process.env.WC_jwtPrivateKey,
        {
            expiresIn: '1d'
        },
        (error, emailToken) => {
            if(error){
                res.status(500).send({
                    message: "Failed to sign jwt token"
                });
            }
            try{
                sendMail(UserObj, emailToken);
                res.status(202).send({
                    message: "Please verify your email by clicking on the link we just mailed you"
                });
            }catch(err){
                res.status(500).send({message: "Couln't process your request"});
            }
        }
    );
    
    // Generate auth token and send. // Instead send confimation mail and respond user to notify that
    // const token = newUser.genAuthToken();
    // res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'first_name','last_name', 'email']));
});
// #### Tested: works fine
// Email verification route.
router.get('/confirmation/:token', async (req, res)=>{
    try{
        const {user:{id}} = jwt.verify(req.params.token, process.env.WC_jwtPrivateKey);
        await User.updateOne({_id:id}, {$set:{"credentials.confirmed": true}});
        res.header('x-auth-token', req.params.token);
        res.status(201).send({message:"Email verified"});

        //After Email Confirmation make empty userProfile with id
        // {
        //     "user_id": "",
        //     "prefessional_info":[],
        //     "educational_info":[],
        //     "personal_info":{
        //         "about_me":"",
        //         "birthdate":""
        //     },
        //     "contact_info":{
        //         "mobile_no":"",
        //         "email":""
        //     },
        //     "profiles":{
        //         "linkedin":"",
        //         "github":"",
        //         "twitter":"",
        //         "youtube":"",
        //         "facebook":"",
        //         "instagram":""
        //     }
        // }

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