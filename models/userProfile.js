const  mongoose  = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Type.object_id
    },
    professional_info: [
        {
            post    : String,
            company : String,
            from    : String,
            to      : String
        }
    ],
    educational_info:[
        {
            school  : String,
            course  : String,
            score   : String,
            outof   : String,
        }
    ],
    personal_info: {
        about_me    : String,
        birthdate   : Date
    },
    contact_info: {
        mobile_no   : Number,
        email       : String
    },
    profiles: {
        linkedin    : String,
        github      : String,
        twitter     : String,
        facebook    : String,
        youtube     : String,
        instagram   : String
    }
});

// Creating mongoDB model from defined schema
const userProfile = mongoose.model('userProfile', userProfileSchema);

module.exports.userProfile = userProfile;