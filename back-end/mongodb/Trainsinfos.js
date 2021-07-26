const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
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
module.exports=Trainsinfos
