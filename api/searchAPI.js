const { use } = require("../routes");
const User = require("./../models/user-model");

function searchAPI() {
    return {
        searchName(req, res) {
            // const searchedField = req.query.name;
            // User.findMany({name:{$regex: searchedField,$options: '$i'}})
            //     .then(data => {
            //         res.send(data);
            //     })

            User.find({ "first_name" : "Saurabh" }).then(data => {
                res.send(data);
            })
        }
    }
}

module.exports = searchAPI