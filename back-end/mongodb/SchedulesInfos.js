//schedulesinfo Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
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
module.exports=SchedulesInfos
