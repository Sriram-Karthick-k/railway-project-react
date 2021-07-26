import React, { useState } from "react"
import LogoimageswithText from "./utilities/LogoimageswithText"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Error from "./utilities/Error"
import axios from "axios"
import Clock from "./utilities/Clock"
import Navbar from "./utilities/Navbar"
import Datepicker from "./utilities/Datepicker"
import Searchinput from "./utilities/Searchinput"
import { Redirect } from "react-router-dom"

function Index() {
  var [body, setBody] = useState({ verification: "" })
  var [error, setError] = useState({ verification: [0, ""] })
  var [verification, setVerification] = useState(JSON.parse(localStorage.getItem("userData")).user.verification)
  axios.defaults.withCredentials = true

  function findError(event) {
    event.preventDefault()
    if (JSON.parse(localStorage.getItem("userData")).user.verification[0] === body.verification) {
      var verificationBody = { mail: JSON.parse(localStorage.getItem("userData")).user.mail }
      axios
        .post("/verification", verificationBody)
        .then(res => {
          localStorage.setItem("userData", JSON.stringify(res.data))
          setVerification(res.data.user.verification)
        })
        .catch(err => console.log(err))
    } else {
      setError({ verification: [1, "Invalid verification code"] })
    }
  }

  function update(event) {
    var from = document.getElementById("search1").value
    var to = document.getElementById("search2").value
    var date = document.getElementById("date").value
    window.location = "/book-tickets?from=" + from + "&to=" + to + "&date=" + date
  }
  function verificationupdate(event) {
    if (event.target.name === "verification") {
      setBody({ verification: event.target.value, from: body.from, to: body.to, date: body.date })
    }
  }
  function changeInput() {
    var temp = document.getElementById("search1").value
    document.getElementById("search1").value = document.getElementById("search2").value
    document.getElementById("search2").value = temp
  }
  if (JSON.parse(localStorage.getItem("userData")).user.loggedIn === true) {
    return (
      (verification[1] === "NO") ?
        <form className="form copy-text text-center" onSubmit={findError} >
          <LogoimageswithText src="./images/pageLogo.png" name="Railway verification" required="required" />
          <Input placeHolder="Enter verification code" id="verification" onchange={verificationupdate} name="verification" class="" type="number" autofocus="true" />
          <Error message={(error.verification[0] === 0) ? "" : error.verification[1]} />
          < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" text="Verify" />
        </form>
        :
        <div>
          <Clock userName={JSON.parse(localStorage.getItem("userData")).user.userName} mail={JSON.parse(localStorage.getItem("userData")).user.mail} />
          <Navbar active="home" />
          <form className=" container  copy-text text-center">
            <div className="form-index">
              <div className="row">
                <div className="col col-lg-12 col-md-12 col-12">
                  <LogoimageswithText src="./images/logoWeb.png" name="Book tickets" required="required" />
                </div>
                <div className="col col-lg-12 col-md-12 col-12">
                  <Searchinput text="From" name="from" autofocus="true" id="search1" />
                </div>
                <div className="col col-lg-12 col-md-12 col-12">
                  <img className="nav-image" src="./images/arrow.png" alt="navimage" onClick={changeInput} />
                </div>
                <div className="col col-lg-12 col-md-12 col-12">
                  <Searchinput text="To" name="to" autofocus="false" id="search2" />
                </div>
                <div className="col col-lg-12 col-md-12 col-12">
                  <Datepicker name="date" closeonscroll={true} />
                </div>
                <div className="col col-lg-12 col-md-12 col-12">
                  < Button class="btn  btn-lg btn-block btn-outline-success" onclick={update} type="button" text="Find trains" />
                </div>
              </div>
            </div>
          </form>
        </div>
    )
  } else {
    return <div className="spinner-border text-success" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  }
}
export default Index
