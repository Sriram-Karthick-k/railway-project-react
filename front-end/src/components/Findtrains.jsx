import React, { useState } from "react"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Clock from "./utilities/Clock"
import Navbar from "./utilities/Navbar"
import axios from "axios"
import Trainsearchinput from "./utilities/Trainsearchinput"
function Findtrains() {
  var [trainName, setTrainName] = useState([])
  var [stationDetails, setStationDetails] = useState([])
  function findTrain() {
    axios
      .get("/find-trains?trainName=" + document.getElementById("trainSearch").value)
      .then(res => {
        setStationDetails(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  function update() {
    setTrainName(document.getElementById("trainSearch").value)
  }
  var dummy
  if (JSON.parse(localStorage.getItem("userData")).user.loggedIn === true) {
    return (
      <div>
        <Clock userName={JSON.parse(localStorage.getItem("userData")).user.userName} mail={JSON.parse(localStorage.getItem("userData")).user.mail} />
        <Navbar active="find-trains" />
        <form className="copy-text find-train-form text-center" >
          <div className="container">
            <div className="row">
              <div className="col col-lg-8 col-md-8 col-8">
                <Trainsearchinput text="Train Name" name="train-name" autofocus="true" id="trainSearch" />
              </div>
              <div className="col col-lg-4 col-md-4 col-4">
                < Button class="btn  btn-lg btn-block btn-outline-success" type="button" onclick={event => { findTrain(); update() }} text="Find Routes" />
              </div>
            </div>
          </div>
        </form>
        {stationDetails.length !== 0 ?
          <div className="container copy-text find-trains">
            <div className="row">
              <div className="col col-lg-1 col-md-1 col-1">
                <p className="">S.NO</p>
              </div>
              <div className="col col-lg-4 col-md-4 col-4">
                <p className="bold ">STATION NAME</p>
              </div>
              <div className="col col-lg-2 col-md-2 col-2">
                <p className="bold text-center">CODE</p>
              </div>
              <div className="col col-lg-2 col-md-2 col-2">
                <p className="bold text-center">ARRIVES</p>
              </div>
              <div className="col col-lg-2 col-md-2 col-2">
                <p className="bold text-center">DEPART</p>
              </div>
              <div className="col col-lg-1 col-md-1 col-1">
                <p className="bold text-center">DAY</p>
              </div>
            </div>
            {stationDetails.map(((station, index) => {
              return (
                <div className="row" key={station.id} >
                  <div className="col col-lg-1 col-md-1 col-1">
                    <p className="">{index + 1}</p>
                  </div>
                  <div className="col col-lg-4 col-md-4 col-4">
                    <p className="">{station.station_name}</p>
                  </div>
                  <div className="col col-lg-2 col-md-2 col-2">
                    <p className="text-center">{station.station_code}</p>
                  </div>
                  <div className="col col-lg-2 col-md-2 col-2">
                    <p className="text-center">{station.arrival}</p>
                  </div>
                  <div className="col col-lg-2 col-md-2 col-2">
                    <p className="text-center">{station.departure}</p>
                  </div>
                  <div className="col col-lg-1 col-md-1 col-1">
                    <p className="text-center">{station.day}</p>
                  </div>
                </div>
              )
            }))}
          </div>
          :
          <h1 className="text-center copy-text not-found-text">No trains Found</h1>
        }
      </div>
    )
  } else {
    return <h1>" "</h1>
  }
}
export default Findtrains