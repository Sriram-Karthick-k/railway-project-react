import React, {
  useState
} from "react"
import LogoimageswithText from "./utilities/LogoimageswithText"
import Input from "./utilities/Input"
import Button from "./utilities/Button"
import Copyrights from "./utilities/copyrights"
import Error from "./utilities/Error"
import axios from "axios"


function Signup() {
  var [userInfo, setUserInfo] = useState("")
  axios.defaults.withCredentials = true
  var [body, setBody] = useState({
    mail: "",
    userName: "",
    password: "",
    confirmPassword: ""
  })
  var initial = {
    mail: [0, ""],
    userName: [0, ""],
    password: [0, ""],
    confirmPassword: [0, ""]
  }
  var [redirect, setRedirect] = useState(false)
  var [error, setError] = useState(initial)
  function findError(event) {
    event.preventDefault()
    console.log(body)
    axios
      .post("/sign-up", body)
      .then(res => {
        if (res.data != null) {
          setError(res.data)
        } else {
          setError(initial);
          setRedirect(true)
          window.location = "/sign-in"
        }
      })
      .catch(err => console.log(err))
  }
  function update(event) {
    if (event.target.name === "mail") {
      setBody({
        mail: event.target.value,
        userName: body.userName,
        password: body.password,
        confirmPassword: body.confirmPassword
      })
    } else if (event.target.name === "userName") {
      setBody({
        mail: body.mail,
        userName: event.target.value,
        password: body.password,
        confirmPassword: body.confirmPassword
      })
    } else if (event.target.name === "password") {
      setBody({
        mail: body.mail,
        userName: body.userName,
        password: event.target.value,
        confirmPassword: body.confirmPassword
      })
    } else {
      setBody({
        mail: body.mail,
        userName: body.userName,
        password: body.password,
        confirmPassword: event.target.value
      })
    }
  }
  if (!JSON.parse(localStorage.getItem("userData"))) {
    return (
      <form className="form copy-text" onSubmit={findError} >
        <LogoimageswithText src="./images/pageLogo.png" name="Railway SignUp" required="required" />
        <Input autocomplete="off" placeHolder="Email" name="mail" class="" type="email" onchange={update} autofocus="true" />
        <Error message={(error.mail[0] === 0) ? "" : error.mail[1]} />
        <Input autocomplete="off" placeHolder="User Name" name="userName" class="" type="text" onchange={update} autofocus="false" />
        <Error message={(error.userName[0] === 0) ? "" : error.userName[1]} />
        <Input autocomplete="off" placeHolder="Password" name="password" class="" type="password" onchange={update} autofocus="false" />
        < Error message={(error.password[0] === 0) ? "" : error.password[1]} />
        <Input autocomplete="off" placeHolder="Confirm Password" name="confirmPassword" class="" type="password" onchange={update} autofocus="false" />
        < Error message={(error.confirmPassword[0] === 0) ? "" : error.confirmPassword[1]} />
        < Button class="btn  btn-lg btn-block btn-outline-success" type="submit" text="Sign Up" />
        < Copyrights />
      </form>
    )
  } else {
    return <div class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  }
}
export default Signup
