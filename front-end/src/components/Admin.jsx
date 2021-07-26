import React, { useState } from "react"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Error from "./utilities/Error"
import Trainsearchinput from "./utilities/Trainsearchinput"
import Datepicker from "./utilities/Datepicker"
import axios from "axios"
function Admin() {
  var [error, setError] = useState({ user: [0, ""], password: [0, ""] })
  var [admin, setAdmin] = useState({ admin: "", password: "" })
  var [visibility, setvisibility] = useState(false)
  var [body, setBody] = useState({ trainName: "", date: "", capacity: 0 })
  function update(event) {
    if (event.target.name === "admin") {
      setAdmin({ admin: event.target.value, password: admin.password })
    } else {
      setAdmin({ admin: admin.admin, password: event.target.value })
    }
  }
  function findError() {
    if (admin.admin != "sriram") {
      setError({ user: [1, "Invalid user"], password: error.password })
    }
    if (admin.password != "1234") {
      setError({ user: error.user, password: [1, "Invalid password"] })
    }
    if (admin.password == "1234" && admin.admin === "sriram") {
      setError({ user: [0, ""], password: [0, ""] })
      setvisibility(true)
    }
  }
  function createTrain() {
    var trainName = document.getElementById("trainSearch").value
    var date = document.getElementById("date").value
    var capacity = document.getElementById("capacity").value
    axios
      .post("/admin", { trainName: trainName, date: date, capacity: capacity })
      .then(res => {
        if (res.data == true) {
          window.location = "/sign-in"
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <form className="copy-text find-train-form text-center">
      <div className="row">
        <div className="col col-lg-3 col-md-3 col-3">
          <Input placeHolder="Admin user name" onchange={update} name="admin" class="" type="text" required="required" autofocus="true" autocomplete="off" />
          <Error message={(error.user[0] === 0) ? "" : error.user[1]} />
        </div>
        <div className="col col-lg-3 col-md-3 col-3">
          <Input placeHolder="password" onchange={update} name="password" class="" type="text" required="required" autofocus="false" autocomplete="off" />
          <Error message={(error.password[0] === 0) ? "" : error.password[1]} />
        </div>
        <div className="col col-lg-3 col-md-3 col-3">
          < Button class="btn  btn-lg btn-block btn-outline-success" onclick={findError} type="button" text="Find Routes" />
        </div>
      </div>
      {visibility ?
        <form className="copy-text find-train-form text-center" >
          <div className="container">
            <div className="row">
              <div style={{ padding: "0!important" }} className="col col-lg-12 col-md-12 col-12">
                <Trainsearchinput text="Train Name" name="train-name" autofocus="true" id="trainSearch" />
              </div>
              <div className="col col-lg-12 col-md-12 col-12">
                <Datepicker name="date" closeonscroll={true} />
              </div>
              <div className="col col-lg-12 col-md-12 col-12">
                <Input placeHolder="Enter train seat capacity" id="capacity" name="seat" class="" type="number" autofocus="false" />
              </div>
              <div className="col col-lg-3 col-md-3 col-3">
                < Button class="btn  btn-lg btn-block btn-outline-success" onclick={createTrain} type="button" text="Create train" />
              </div>
            </div>
          </div>
        </form>
        :
        ""
      }
    </form>
  )
}
export default Admin