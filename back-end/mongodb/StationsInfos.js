//stationinfo Schema
const mongoose=require("./Main.js")
var Schema = mongoose.Schema;
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
module.exports=StationsInfos
