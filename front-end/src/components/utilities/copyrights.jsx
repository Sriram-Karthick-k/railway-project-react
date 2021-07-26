import React from "react"
function Copyrights() {
  var year = new Date().getFullYear()
  var styles = { marginTop: "1rem" }
  return (<p className="text-center copyright" style={styles}>© {year}</p>)
}
export default Copyrights;
