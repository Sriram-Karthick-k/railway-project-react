import React, { useState } from "react"
import LogoimageswithText from "./utilities/LogoimageswithText"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Copyrights from "./utilities/copyrights"
import Error from "./utilities/Error"
import Alink from "./utilities/Alink"
import axios from "axios"

function Signin() {
  axios.defaults.withCredentials = true
  var [body, setBody] = useState({ mail: "", password: "" })
  var initial = { mail: [0, ""], password: [0, ""] }
  var [error, setError] = useState(initial)
  function findError(event) {
    event.preventDefault()
    axios
      .post("/sign-in", body)
      .then(res => {
        if (res.data.auth === false) {
          setError(res.data)
        } else {
          setError(initial)
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("userData", JSON.stringify(res.data))
          window.location = "/"
        }
      })
      .catch(err => console.log(err))
  }
  function update(event) {
    if (event.target.name === "mail") {
      setBody({
        mail: event.target.value,
        password: body.password
      })
    } else {
      setBody({
        mail: body.mail,
        password: event.target.value
      })
    }
  }
  if (!JSON.parse(localStorage.getItem("userData"))) {
    return (
      <form className="form copy-text text-center" onSubmit={findError} >
        <LogoimageswithText src="./images/pageLogo.png" name="Railway Signin" />
        <Input placeHolder="Enter Email" onchange={update} name="mail" class="" type="text" required="required" autofocus="true" autocomplete="off" />
        <Error message={(error.mail[0] === 0) ? "" : error.mail[1]} />
        <Input placeHolder="password" name="password" onchange={update} class="" type="password" required="required" autofocus="false" autocomplete="off" />
        <Error message={(error.password[0] === 0) ? "" : error.password[1]} />
        < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" text="Sign In" />
        <Alink class="Alink " name="Create a new account?" link="/sign-up" />
        <Alink class="Alink " name="Forgot password" link="/forgot" />
        <Copyrights />
      </form>
    )
  } else {
    return <div class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  }
}
export default Signin
