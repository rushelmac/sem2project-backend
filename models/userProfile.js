const { Mongoose } = require("mongoose");

const userProfile = new mongoose.schema({
    user_id:{
        type: Mongoose.Schema.Type.object_id
    },
    professional_info: [
        {
            post: String,
            company: String,
            from:String,
            to: String
        }
    ],
    educational_info:[
        {
            school:String,
            course:String,
            score:String,
            outof:String,
        }
    ],
    personal_info: {
        about_me: String,
        birthdate:Date,
    },
    contact_info: {
        mobile_no: Number,
        email: String,
    },
    profiles: {
        linkedin: String,
        github: String,
        twitter: String,
    }
});

module.exports.userProfile = userProfile;