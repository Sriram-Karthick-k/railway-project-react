import React, { useEffect, useState } from "react"
import axios from "axios"
import queryString from "query-string"
import Clock from "./utilities/Clock"
import Navbar from "./utilities/Navbar"
import Datepicker from "./utilities/Datepicker"
import Searchinput from "./utilities/Searchinput"
import Button from "./utilities/Button"
function BookTickets(props) {
  var query = queryString.parse(window.location.search)
  var [trains, setTrains] = useState([[], []])
  useEffect(() => {
    axios
      .get("/book-tickets?from=" + query.from + "&to=" + query.to + "&date=" + query.date)
      .then(res => {
        if (res.data.length !== 0) {
          setTrains(res.data)
          document.getElementById("date").value = query.date
          document.getElementById("search1").value = query.from
          document.getElementById("search2").value = query.to
        }
      })
      .catch(err => console.log(err))
  }, [])
  function update(event) {
    var from = document.getElementById("search1").value
    var to = document.getElementById("search2").value
    var date = document.getElementById("date").value
    window.location = "/book-tickets?from=" + from + "&to=" + to + "&date=" + date
  }
  function changeInput() {
    var temp = document.getElementById("search1").value
    document.getElementById("search1").value = document.getElementById("search2").value
    document.getElementById("search2").value = temp
  }

  function directTrainUpdate(event) {
    window.location = "/process?express=" + document.getElementById("directTrainName" + event.target.id).innerHTML + "&from=" + query.from + "&to=" + query.to + "&date=" + query.date
  }
  function inDirectTrainUpdate(event) {
    window.location = "/process?express=" + document.getElementById("inDirectTrainName" + event.target.id).innerHTML + "&from=" + query.from + "&to=" + query.to + "&date=" + query.date
  }
  var dummy
  if (JSON.parse(localStorage.getItem("userData")).user.loggedIn === true) {
    return (
      <div>
        <Clock userName={JSON.parse(localStorage.getItem("userData")).user.userName} mail={JSON.parse(localStorage.getItem("userData")).user.mail} />
        <Navbar active="home" />
        <div className="container booking-ticket-container">
          <div className="row">
            <div className="col col-lg-3 col-md-3 col-3">
              <Searchinput text="From" name="from" autofocus="false" id="search1" />
            </div>
            <div className=" col col-lg-1 col-md-1 col-1">
              <img className="nav-image book-ticket-nav-image" src="./images/arrow-right.png" alt="navimage" onClick={changeInput} />
            </div>
            <div className="col col-lg-3 col-md-3 col-3">
              <Searchinput text="To" name="to" autofocus="false" id="search2" />
            </div>
            <div className="col col-lg-3 col-md-3 col-3">
              <Datepicker name="date" />
            </div>
            <div className="col col-lg-2 col-md-2 col-2">
              < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" onclick={event => { update(); }} text="Find trains" />
            </div>
          </div>
        </div>
        {trains[0].length === 0 ? <h1 className="text-center copy-text not-found-text">No Direct trains Found</h1> :
          <h1 className="text-center copy-text ">Direct trains</h1>}
        {trains[0].length !== 0 ?
          trains[0].map((train, index) => {
            var trainName = "directTrainName" + index
            return (
              <form className="train-details-container container copy-text " key={train.train_number}>
                <div className="container">
                  <div className="row">
                    <div className="col col-lg-5 col-md-5 col-5">
                      <p className="text-center item-title">Express Name : <span id={trainName} className="item-value">{train.train_name}</span></p>
                      <p className="text-center item-title">( Train no : <span className="item-value">{train.train_number}</span> )</p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-3">
                      <p className="text-center item-title">{train.from_station_name} </p>
                      <p className="text-center item-title">Code : <span className="item-value">{train.from_station_code}</span></p>
                    </div>
                    <div className="col col-lg-1 col-md-1 col-1">
                      <img src="./images/right-arrow.png" alt="" />
                    </div>
                    <div className="col col-lg-3 col-md-3 col-3">
                      <p className="text-center item-title">{train.to_station_name} </p>
                      <p className="text-center item-title">Code : <span className="item-value">{train.to_station_code}</span></p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Journey Duration : <span className="item-value">{train.duration_h}h {train.duration_m}m</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Departure : <span className=" item-value">{(train.departure.split(":")[0] > "12") ? train.departure + " P.M" : train.departure + " A.M"}</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Arrival : <span className=" item-value">{(train.arrival.split(":")[0] > "12") ? train.arrival + " P.M" : train.arrival + " A.M"}</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Bording Till : <span className=" item-value">{query.to.split("-")[0]}</span> </p>
                    </div>
                    <div className="text-center button col col-lg-12 col-md-12 col-sm-12">
                      < Button id={index} class="btn  btn-lg btn-outline-success" type="button" onclick={directTrainUpdate} text="Book Tickets" />
                    </div>
                  </div>
                </div>
              </form>
            )
          })
          :
          dummy = ""
        }
        {
          trains[1].length === 0 ? <h1 className="text-center copy-text not-found-text">No In-Direct trains Found</h1> :
            <h1 className="text-center copy-text ">In-Direct trains</h1>
        }
        {trains[1].length !== 0 ?
          trains[1].map((train, index) => {
            var trainName = "inDirectTrainName" + index
            return (
              <form className="train-details-container container copy-text " key={train.train_number}>
                <div className="container">
                  <div className="row">
                    <div className="col col-lg-5 col-md-5 col-5">
                      <p className="text-center item-title">Express Name : <span id={trainName} className="item-value">{train.train_name}</span></p>
                      <p className="text-center item-title">( Train no : <span className="item-value">{train.train_number}</span> )</p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-3">
                      <p className="text-center item-title">{train.from_station_name} </p>
                      <p className="text-center item-title">Code : <span className="item-value">{train.from_station_code}</span></p>
                    </div>
                    <div className="col col-lg-1 col-md-1 col-1">
                      <img src="./images/right-arrow.png" alt="" />
                    </div>
                    <div className="col col-lg-3 col-md-3 col-3">
                      <p className="text-center item-title">{train.to_station_name} </p>
                      <p className="text-center item-title">Code : <span className="item-value">{train.to_station_code}</span></p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Journey Duration : <span className="item-value">{train.duration_h}h {train.duration_m}m</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Departure : <span className=" item-value">{(train.departure.split(":")[0] > "12") ? train.departure + " P.M" : train.departure + " A.M"}</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Arrival : <span className=" item-value">{(train.arrival.split(":")[0] > "12") ? train.arrival + " P.M" : train.arrival + " A.M"}</span> </p>
                    </div>
                    <div className="col col-lg-3 col-md-3 col-sm-3">
                      <p className="text-center item-title">Bording At : <span className=" item-value">{query.to.split("-")[0]}</span> </p>
                    </div>
                    <div className="text-center button col col-lg-12 col-md-12 col-sm-12">
                      < Button id={index} class="btn  btn-lg btn-outline-success" type="button" onclick={inDirectTrainUpdate} text="Book Tickets" />
                    </div>
                  </div>
                </div>
              </form>
            )
          })
          :
          dummy = ""
        }
      </div>
    )
  } else {
    return <div class="spinner-border text-success" >
      <span class="sr-only">Loading...</span>
    </div>
  }
}
export default BookTickets