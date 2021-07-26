import React, { useState } from "react"
import Text from "./Text"

function Clock(props) {
  const [clock, setclock] = useState(new Date().toLocaleTimeString())
  function clockChange() {
    setclock(new Date().toLocaleTimeString())
  }
  setInterval(clockChange, 1000);
  return (
    <div className="clock-container">
      <div className="container clock-container copy-text">
        <div className="row">
          <div className="col col-lg-4 col-md-12 col-12">
            <Text text={props.userName} icon="far fa-user" />
          </div>
          <div className="col col-lg-4 col-md-12 col-12">
            <Text text={props.mail} icon="fas fa-envelope" />
          </div>
          <div className="col col-lg-4 col-md-12 col-12" >
            <Text text={clock} icon="far fa-clock" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Clock