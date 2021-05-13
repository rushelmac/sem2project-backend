const { use } = require("../routes");
const user_model = require("./../models/user-model");

function searchAPI() {
    return {
        searchName(req, res) {
            var regex = new RegExp(req.params.name,'i');
            user_model.find({first_name:regex}).then((result) => {
                 return res.status(200).json(result);
            })
        }
    }
}

module.exports = searchAPI