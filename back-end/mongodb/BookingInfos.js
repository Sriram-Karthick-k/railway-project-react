//booking info schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
var bookinginfo = new Schema({
  totalSeats:Number,
  date: String,
  trainName: String,
  booked_tickets: [],
  waiting_tickets: [],
  remaining_seats:[]
})
var BookingsInfo = mongoose.model("BookingsInfo", bookinginfo);
module.exports=BookingsInfo
