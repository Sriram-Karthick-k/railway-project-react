import React from "react"
import {Link} from "react-router-dom"

function Alink(props){
  return(
      <Link to={props.link} className={props.class}>{props.name}</Link>
  )
}
export default Alink
