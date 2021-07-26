import React from "react"

function LogoimageswithText(props) {
  var classname = "text-center mb-4 "
  return (
    <div className={classname}>
      <img src={props.src} alt="images" className="logo-images" />
      <h1 className="h3 mb-3">{props.name}</h1>
    </div>
  )
}
export default LogoimageswithText;
