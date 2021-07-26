import mongoose from "mongoose"
//data-base
mongoose.connect('mongodb://localhost:27017/Railway-DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var Schema = mongoose.Schema;
//user info schema
var userinfo = new Schema({
  userName: String,
  mailId: String,
  password: String,
  verification: String,
  wrongAttemp: Number,
  verificationStatus: String,
  lock: String,
  oneTimePassword: String,
  BookingDetails: []
})
var UserInfo = mongoose.model("UserInfo", userinfo);
//trainsinfo schema
var trainisinfos = new Schema({
  trainId: Number,
  train_name: String,
  train_number: String,
  from_station_name: String,
  from_station_code: String,
  departure: String,
  to_station_name: String,
  to_station_code: String,
  arrival: String,
  distance: Number,
  return_number: String,
  duration_h: Number,
  duration_m: Number,
  type: String,
  third_ac: Number,
  zone: String,
  chair_car: Number,
  first_class: Number,
  sleeper: Number,
  second_ac: Number,
  first_ac: Number,
  train_coordinates: []
})
var Trainsinfos = mongoose.model("Trainsinfos", trainisinfos);
//stationinfo Schema
var stationsinfos = new Schema({
  station_name: String,
  station_code: String,
  state: String,
  zone: String,
  address: String,
  station_coordinates: [],
  stationId: Number
})
var StationsInfos = mongoose.model("StationsInfos", stationsinfos);
//schedulesinfo Schema
var schedulesinfos = new Schema({
  arrival: String,
  day: Number,
  departure: String,
  id: Number,
  station_code: String,
  station_name: String,
  train_name: String,
  train_number: String
});
var SchedulesInfos = mongoose.model("SchedulesInfos", schedulesinfos);

//booking info schema
var bookinginfo = new Schema({
  date:String,
  trainName:String,
  booked_tickets:[],
  waiting_tickets:[]
})
var BookingsInfo = mongoose.model("BookingsInfo", bookinginfo);
export {Trainsinfos,SchedulesInfos,StationsInfos,UserInfo}
