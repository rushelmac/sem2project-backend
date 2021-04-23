const nodemailer = require("nodemailer");
const transporter_config = require("../configurations/nodemailer");

const transporter = nodemailer.createTransport(transporter_config);
const sendMail = () => {

    let mailBody = {
        from: '"WCE Connects" <rushishelke633@gmail.com>', // sender address
        to: "rushikesh.shelke@walchandsangli.ac.in", // list of receivers
        subject: "OTP authentication: WCE Connects", // Subject line
        text: "Your One Time Password is : 1234", // plain text body
    };
    transporter.sendMail(mailBody,(err, info) => {
        if(err){
            console.log("There was error sending mail " + err);
        }else{
            console.log("Mail sent !!", + info);
        }
    });
};



module.exports = sendMail;

