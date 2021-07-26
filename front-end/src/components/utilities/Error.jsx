import React from "react"

function Error(props) {
  const styles = { color: "red", margin: "0", fontSize: "1rem" }
  return (<p style={styles} className="text-center">{props.message}</p>)
}
export default Error
