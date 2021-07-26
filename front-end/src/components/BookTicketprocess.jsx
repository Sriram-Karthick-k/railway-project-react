import React, { useState, useEffect } from "react"
import axios from "axios"
import queryString from "query-string"
import Clock from "./utilities/Clock"
import Navbar from "./utilities/Navbar"
import Input from "./utilities/Input"
import Button from "./utilities/Button"


function BookTicketprocess(props) {
  var query = queryString.parse(window.location.search)
  var [trainDetails, setTrainDetails] = useState({ train_name: "" })
  var [passangers, setPassangers] = useState([{ name: "", gender: "", citizenship: "" }])
  var [trainSeatDetails, setTrainSeatDetails] = useState(0)
  useEffect(() => {
    axios
      .get("/train-details?trainName=" + query.express)
      .then(res => {
        setTrainDetails(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    axios
      .get("/train-availability?trainName=" + query.express + "&date=" + query.date + "&from=" + query.from + "&to=" + query.to)
      .then(res => {
        setTrainSeatDetails(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  function addPassanger() {
    var out = []
    for (var i = 0; i < passangers.length; i++) {
      var push = { name: document.getElementById("name" + i).value, gender: document.getElementById("gender" + i).value, citizenship: document.getElementById("citizenship" + i).value }
      out.push(push)
    }
    out.push({ name: "", gender: "", citizenship: "" })
    setPassangers(out)
  }
  function bookTicket() {
    var out = []
    for (var i = 0; i < passangers.length; i++) {
      var push = { name: document.getElementById("name" + i).value, gender: document.getElementById("gender" + i).value, citizenship: document.getElementById("citizenship" + i).value }
      out.push(push)
    }
    setPassangers(out)
    var passangerDetails = { trainName: query.express, from: query.from, to: query.to, date: query.date, passangers: out, mail: JSON.parse(localStorage.getItem("userData")).user.mail }
    axios
      .post("/ticket-booking-process", passangerDetails)
      .then(res => {
        console.log(res.data)
        if (res.data == true) {
          window.location = "/"
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  if (JSON.parse(localStorage.getItem("userData")).user.loggedIn === true) {
    return (
      <div className="copy-text">
        <Clock userName={JSON.parse(localStorage.getItem("userData")).user.userName} mail={JSON.parse(localStorage.getItem("userData")).user.mail} />
        <Navbar active="home" />
        <div className="container ">
          <div className="train-details-container">
            <div className="container">
              <div className="row">
                <div className="col col-lg-6 col-md-6 col-6">
                  <p className="item-title">Express Name : <span className="item-value" >{trainDetails.train_name}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3">
                  <p className="item-title">Train Number : <span className="item-value" >{trainDetails.train_number}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3">
                  <p className="item-title">Total Distance : <span className="item-value" >{trainDetails.distance}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3">
                  <p className="item-title">Boarding At : <span className="item-value" >{query.from}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3 ">
                  <p className="item-title">Boarding till : <span className="item-value" >{query.to}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3 ">
                  <p className="item-title">Journey Date : <span className="item-value" >{query.date}</span></p>
                </div>
                <div className="col col-lg-3 col-md-3 col-3 ">
                  <p className="item-title">Seat available : <span className="item-value" >{trainSeatDetails.trainSeatAvailable}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container passanger">
          <h1 className="text-center" >Passanger Details</h1>
          <div className="row">
            <div className=" text-center col col-lg-1 col-md-1 col-1">
              <p style={{ marginTop: "12px" }}>S.NO</p>
            </div>
            <div className="text-center col col-lg-4 col-md-4 col-4">
              <p style={{ marginTop: "12px" }}>Passanger Name</p>
            </div>
            <div className="text-center col col-lg-3 col-md-3 col-3">
              <p style={{ marginTop: "12px" }}>Gender</p>
            </div>
            <div className="text-center col col-lg-4 col-md-4 col-4">
              <p style={{ marginTop: "12px" }}>Citizenship</p>
            </div>
            {passangers.map((details, index) => {
              var [name, gender, citizenship] = ["name" + index, "gender" + index, "citizenship" + index]
              return (
                <div className="row col-lg-12 col-md-12 col-12" key={index}>
                  <div className=" text-center col col-lg-1 col-md-1 col-1">
                    <p style={{ marginTop: "12px" }}>{index + 1}</p>
                  </div>
                  <div className="text-center col col-lg-4 col-md-4 col-4">
                    <Input id={name} placeHolder="Passanger name" name="name" class="" type="text" required="required" autofocus="true" autocomplete="off" />
                  </div>
                  <div className="text-center col col-lg-3 col-md-3 col-3">
                    <Input id={gender} placeHolder="Gender" name="gender" type="text" required="required" autofocus="false" autocomplete="off" ></Input>
                  </div>
                  <div className="text-center col col-lg-4 col-md-4 col-4">
                    <Input id={citizenship} placeHolder="Citizenship" name="gender" type="text" required="required" autofocus="false" autocomplete="off" ></Input>
                  </div>
                </div>
              )
            })}
            <div className="text-center col col-lg-1 col-md-1 col-1">
              {(passangers.length === 5) ? "" : <img src="./images/plus.png" alt="add" onClick={addPassanger} />}
            </div>
            <div className="row col-lg-12 col-md-12 col-12 text-center">
              < Button class="button-ticket-center col-lg-3 col-md-3 col-3 btn  btn-lg  btn-outline-success" type="button" onclick={bookTicket} text="Book Ticket" />
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default BookTicketprocess