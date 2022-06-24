const mongoose = require("mongoose");

var Schema  = mongoose.Schema

const logSchema = new Schema({
    id : String,
    email : String,
    action : String,
    token :String
},{timestamps:true})

module.exports = mongoose.model("log", logSchema)