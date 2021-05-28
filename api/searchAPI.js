const { functions } = require("lodash");
<<<<<<< HEAD
// const { use } = require("../routes");
const User = require("./../models/user");
=======
// const { use } = require("../routes");
const User = require("../models/User");
>>>>>>> e7fb5104353135e256930ededa75b684ba788838

module.exports = {
    searchName: function(req, res, next) {
        const searchedField = req.query.name;
        User.User.find(
            { $or: 
                [
                    {first_name: {$regex: searchedField,$options:'$i'}},
                    {last_name: {$regex: searchedField,$options:'$i'}}
                ] 
            }
        ).then(data => {
            res.send(data);
        })
    },
    searchRole: function(req, res, next) {
        const searchedField = req.query.name;
        User.User.find({user_role:searchedField})
            .then(data => {
                res.send(data);
            }) 
    }  
}