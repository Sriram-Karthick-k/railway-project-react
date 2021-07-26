import React, { useState, useEffect } from "react"
import axios from "axios"
import Clock from "./utilities/Clock"
import Navbar from "./utilities/Navbar"
import Button from "./utilities/Button"
import { Link } from "react-router-dom"

function BookedTickets() {
  var [booking_details, setBookingDetails] = useState([])
  useEffect(() => {
    axios
      .get("/booking-history?userName=" + JSON.parse(localStorage.getItem("userData")).user.userName)
      .then(res => {
        setBookingDetails(res.data)
      })
      .catch(err => console.log(err))
  }, [])
  function handleOpenAndClose(event) {
    var index = event.target.id.split("-")
    var passangerDiv = "passangerDiv" + index[1]
    var div = document.getElementById(passangerDiv)
    if (index[0] === "passangerOpen") {
      div.className = "passanger-details page-center"
    } else {
      div.className = "passanger-details-invisible page-center"
    }
  }
  if (JSON.parse(localStorage.getItem("userData")).user.loggedIn === true) {
    return (
      <div className="copy-text">
        <Clock userName={JSON.parse(localStorage.getItem("userData")).user.userName} mail={JSON.parse(localStorage.getItem("userData")).user.mail} />
        <Navbar active="book-ticket" />
        {booking_details.length === 0 ? <h1 className="text-center not-found-text">No Tickets have been booked</h1> : <h1 className="text-center">Booked Tickets</h1>}
        <div className="container ">
          {booking_details.map((info, index) => {
            var passangerOpen = "passangerOpen-" + index
            var passangerClose = "passangerClose-" + index
            var passangerDiv = "passangerDiv" + index
            return (
              <div className="container train-booked-container " key={index}>
                <div className="row">
                  <div className="col col-lg-5 col-md-5 col-5">
                    <p className="text-center item-title">Express Name : <span className="item-value">{info.trainName}</span></p>
                    <p className="text-center item-title">( Train no : <span className="item-value">{info.trainNumber}</span> )</p>
                  </div>
                  <div className="col col-lg-3 col-md-3 col-3">
                    <p className="text-center item-title">{info.from.split(" - ")[0]} </p>
                    <p className="text-center item-title">Code : <span className="item-value">{info.from.split(" - ")[1]}</span></p>
                  </div>
                  <div className="col col-lg-1 col-md-1 col-1">
                    <img src="./images/right-arrow.png" alt="" />
                  </div>
                  <div className="col col-lg-3 col-md-3 col-3">
                    <p className="text-center item-title">{info.to.split(" - ")[0]}</p>
                    <p className="text-center item-title">Code : <span className="item-value">{info.to.split(" - ")[1]}</span></p>
                  </div>
                  <div className="col col-lg-4 col-md-4 col-4">
                    <p className="text-center item-title">Date of journey : <span className="item-value">{info.date}</span></p>
                  </div>
                  <div className="col col-lg-4 col-md-4 col-4">
                    <p className="text-center item-title">Number of tickets : <span className="item-value">{info.passangers.length}</span></p>
                  </div>
                  <div className="col col-lg-4 col-md-4 col-4">
                    <p className="text-center item-title">Booking status : <span className={info.bookingStatus === "Not confirmed" ? "item-value not-found-text" : "item-value"}>{info.bookingStatus}</span></p>
                  </div>
                  <div className="text-center button col col-lg-12 col-md-12 col-sm-12">
                    < Button id={passangerOpen} onclick={handleOpenAndClose} class="btn  btn-lg btn-outline-success" type="button" text="view passanger details" />
                  </div>
                </div>
                <div id={passangerDiv} className="passanger-details-invisible page-center">
                  <Link to="#"  ><i id={passangerClose} onClick={handleOpenAndClose} className="fa fa-times float-right" ></i></Link>
                  <div className="row " >
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
                  </div>
                  {info.passangers.map((passanger, passindex) => {
                    return (
                      <div className="row" key={passindex} >
                        <div className=" text-center col col-lg-1 col-md-1 col-1">
                          <p style={{ marginTop: "12px" }}>{passindex + 1}</p>
                        </div>
                        <div className="text-center col col-lg-4 col-md-4 col-4">
                          <p style={{ marginTop: "12px" }}>{passanger.name}</p>
                        </div>
                        <div className="text-center col col-lg-3 col-md-3 col-3">
                          <p style={{ marginTop: "12px" }}>{passanger.gender} </p>
                        </div>
                        <div className="text-center col col-lg-4 col-md-4 col-4">
                          <p style={{ marginTop: "12px" }}>{passanger.citizenship} </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div >
    )
  }
}
export default BookedTickets