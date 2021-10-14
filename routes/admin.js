const { forEach } = require('lodash');

//REGISTER ENDPOINT
const express   = require('express'),
    _           = require('lodash'),
    router      = express.Router(),
    xlstojson   = require("xls-to-json-lc"),
    xlsxtojson  = require("xlsx-to-json-lc"),
    multer      = require('multer'),
    bcrypt      = require('bcrypt'),
    sendMail    = require("../controllers/verify-mail"),
    jwt         = require('jsonwebtoken'),
    { User, validateUser, validateParams } = require('../models/User');

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    // Route to upload xcel database to mongo
    router.post('/upload', function(req, res) {
        let excel2json, newUser;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:401,err_desc:err});
                 return;
            }
            if(!req.file){
                res.json({error_code:404,err_desc:"File not found!"});
                return;
            }

            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                excel2json = xlsxtojson;
            } else {
                excel2json = xlstojson;
            }

           //  code to convert excel data to json  format
            excel2json({
                input: req.file.path,  
                output: null, // output json 
                lowerCaseHeaders:true
            },async function(err, result) {
                if(err) {
                  res.json(err);
                } else {
                    const databaseObjects=[];
                    
                    result.forEach(user => {
                        const databaseObject = {
                            credentials: {
                                email:user.email_id || null,
                                password:user.email_id || null
                            },
                            info :{
                                first_name:user.first_name,
                                last_name:user.last_name,
                                user_role:'alumni',
                                current_post: null,
                                current_organization: null,
                            }
                        };
                        databaseObjects.push(databaseObject);
                    });
                    console.log(result);
                    res.status(200).json(databaseObjects);

                    // const not_sent = [];

                    // await databaseObjects.forEach(async user=>{
                    //     try{
                    //         newUser = new User(user);
                    //         const salt = await bcrypt.genSalt(5);
                    //         newUser.credentials.password = await bcrypt.hash(user.credentials.password, salt);
                    //         newUser = await newUser.save();
                    //     }catch(e){ console.log(e)};

                    //     // Async function to send mail.
                    //     jwt.sign(
                    //         {
                    //             user: _.pick(newUser, 'id'),
                    //         },
                    //         process.env.WC_jwtPrivateKey,
                    //         {
                    //             expiresIn: '1d'
                    //         },
                    //         (error, emailToken) => {
                    //             if(error){
                    //                 res.status(500).send({
                    //                     message: "Failed to sign jwt token"
                    //                 });
                    //             }
                    //             try{
                    //                 sendMail(user, emailToken);
                    //                 res.status(202).send({
                    //                     message: "You have been registered to our portal 'WCE-Connects'. Please verify your email by clicking on the link we just mailed you.\nIf you think this is a mistake, bade bade shehre me aisi choti choti batein hoti rehti hai " + user.credentials.name
                    //                 });
                    //             }catch(err){
                    //                 // res.status(500).send({message: "Couln't process your request"});
                    //                 not_sent.push(user.credentials.email)
                    //             }
                    //         }
                    //     );
                    // });
                    // res.status(200).json({
                    //     msg : "Emails sent",
                    //     exceptions: not_sent
                    // })

                // Upload to database
                }
            });
        });
    });
    

    router.get('/', (req, res) => {
        res.status(200).json({
            message: "Works fine bro"
        });
    }); 
    
module.exports = router;