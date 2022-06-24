
const mongoose = require("mongoose");
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

var Schema = mongoose.Schema;
// {
//   "name":"ankit",
//   "lastname":"mishra",
//   "email":"am1@gmail.com",
//   "password":"123"
// }
var userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  userinfo: {
    type: String,
    trim: true,
  },
  // TODO:
  encry_password: {
    type: String,
    // trim:true,
    required: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    default: [],
  },
},{timestamps:true});

userSchema.virtual("password")
.set(function(pswd){
    this._password = pswd
    this.salt=uuidv1()
    this.encry_password=this.securePassword(pswd)
})
.get(function(){
    return this._password
})

userSchema.methods = {

  authenticate:function(pswd){
      return this.securePassword(pswd) === this.encry_password
  },
  updatePswd:function(pswd){
      return this.encry_password=this.securePassword(pswd)
  },
  securePassword: function (pswd) {
    if (!pswd) return "";
    try {
      return crypto.createHmac("sha256", this.salt).update(pswd).digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
