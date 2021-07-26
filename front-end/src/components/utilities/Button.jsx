import React from "react"

function Buttom(props) {
  return (
    <button id={props.id} type={props.type} onClick={props.onclick} className={props.class}>{props.text}</button>
  )
}
export default Buttom;
