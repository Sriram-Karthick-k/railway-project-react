import React, { useEffect } from "react"
import {
  Redirect
} from "react-router-dom";
import axios from "axios"
function Protected(props) {
  const auth = JSON.parse(localStorage.getItem("userData"))
  useEffect(() => {
    axios
      .get("/isAuth", { headers: { "x-access-token": localStorage.getItem("token") } })
      .then(res => {
        if (res.data.loggedIn === false) {
          localStorage.clear()
          window.location = "/sign-in"
        }
      })

  }, [])
  return <div>{auth ? <props.component /> : <Redirect to="/sign-in" />}</div>
}
export default Protected