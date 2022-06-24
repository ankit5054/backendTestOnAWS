const mongoose = require("mongoose")
// const uuidv1 = require("uuid/v1")
// const crypto = require("crypto")

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name:{
        type: String,
        trim : true,
        required : true,
        maxlength:32,
        unique: true
    },

},{timestamps:true});

module.exports = mongoose.model("Category",categorySchema)