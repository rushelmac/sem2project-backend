const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
    author  : mongoose.Schema.Types.ObjectId,
    text    : String,
    target_audience : String,
    target_branch   : String,
    picture : String
},{timestamps: true});

module.exports.Feed = mongoose.model("Feed", feedSchema); 