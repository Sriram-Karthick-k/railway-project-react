//user info schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var userinfo = new Schema({
  userName: String,
  mailId: String,
  password: String,
  wrongAttemp: Number,
  lock: String,
  oneTimePassword: String,
  verification:[],
  BookingDetails: []
})
var UserInfo = mongoose.model("UserInfo", userinfo);
module.exports=UserInfo
