import React, { useState } from "react"
import LogoimageswithText from "./utilities/LogoimageswithText"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Error from "./utilities/Error"
import axios from "axios"
//forgot
function Forgot() {
  var [messageSent, setmessageSent] = useState(false)
  var [body, setBody] = useState({ mail: "", reset: "", password: "", confirmPassword: "" })
  var initial = { mail: [0, ""], reset: [0, ""], password: [0, ""], confirmPassword: [0, ""] }
  var [error, setError] = useState(initial)
  function findError(event) {
    event.preventDefault()
    axios
      .post("/forgot", { mail: body.mail })
      .then(res => {
        if (res.data != null) {
          setError(res.data)
        } else {
          setError(initial)
          setmessageSent(true)
        }
      })
      .catch(err => console.log(err))
  }
  function reset(event) {
    event.preventDefault()
    console.log(body)
    axios
      .post("/reset", body)
      .then(res => {
        if (res.data != null) {
          setError(res.data)
        } else {
          setError(initial)
          console.log("err")
          window.location = "/sign-in"
        }
      })
      .catch(err => console.log(err))
  }
  function update(event) {
    if (event.target.name === "reset") {
      setBody({
        mail: body.mail,
        reset: event.target.value,
        password: body.password,
        confirmPassword: body.confirmPassword
      })
    }
    if (event.target.name === "mail") {
      setBody({
        mail: event.target.value,
        reset: body.reset,
        password: body.password,
        confirmPassword: body.confirmPassword
      })
    }
    if (event.target.name === "password") {
      setBody({
        mail: body.mail,
        reset: body.reset,
        password: event.target.value,
        confirmPassword: body.confirmPassword
      })
    }
    if (event.target.name === "confirmPassword") {
      setBody({
        mail: body.mail,
        reset: body.reset,
        password: body.password,
        confirmPassword: event.target.value
      })
    }
  }
  if (!messageSent) {
    return (
      <form className="form copy-text text-center" onSubmit={findError}>
        <LogoimageswithText src="./images/pageLogo.png" name="Railway " required="required" />
        <Input autocomplete="off" placeHolder="Enter email to reset password" onchange={update} name="mail" class="" type="email" autofocus="true" />
        <Error message={error.mail[0] === 0 ? "" : error.mail[1]} />
        < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" text="Send Code" />
      </form>
    )
  } else {
    return (
      <form className="form copy-text text-center" onSubmit={reset}>
        <LogoimageswithText src="./images/pageLogo.png" name={body.mail} required="required" />
        <Input autocomplete="off" placeHolder="Enter the reset code which is sent to your mail" onchange={update} name="reset" class="" type="text" autofocus="true" />
        <Error message={error.reset[0] === 0 ? "" : error.rset[1]} />
        <Input autocomplete="off" placeHolder="Password" name="password" class="" onchange={update} type="password" autofocus="false" />
        <Error message={error.password[0] === 0 ? "" : error.password[1]} />
        <Input autocomplete="off" placeHolder="Confirm Password" name="confirmPassword" onchange={update} class="" type="password" autofocus="false" />
        <Error message={error.confirmPassword[0] === 0 ? "" : error.confirmPassword[1]} />
        < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" text="Reset Password" />
      </form>
    )
  }
}
export default Forgot
