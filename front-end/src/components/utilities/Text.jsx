import React from "react"

function Text(props) {
  return (
    <h5 className="Simpletext"> <span className="clock-font"><i className={props.icon}></i></span>{props.text}</h5>
  )
}
export default Text