import React, { useState } from "react"
import axios from "axios"
import Input from "./Input"

function Searchinput(props) {
  var [display, setDisplay] = useState(false)
  var [option, setOptions] = useState([{ label: "" }]);
  function autocomplete(event) {
    if (event.target.value.length >= 1) {
      setDisplay(true)
      axios
        .get("/autocomplete?search=" + event.target.value)
        .then(res => {
          setOptions(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setDisplay(false)
      setOptions([{ lable: "" }])
    }
  }
  function updateInput(event) {
    document.getElementById(props.id).value = event.target.textContent
    setDisplay(false)
    setOptions([{ lable: "" }])
  }
  function focusOut() {
    setDisplay(false)
    setOptions([{ lable: "" }])
  }
  return (
    <div className="container" onFocus={focusOut}>
      <Input placeHolder={props.text} value={props.value} required="required" id={props.id} onchange={event => { autocomplete(event); }} name={props.name} class="" type="text" autofocus={props.autofocus} autocomplete="off" />
      {
        display ?
          <div className="item-container">
            {option.length !== 0 ?
              option.map((name, i) => {
                return <div className="item" onClick={updateInput} key={i} >
                  <span >{name.label}</span>
                </div>
              })
              :
              ""
            }
          </div>
          :
          ""
      }
    </div>
  )
}
export default Searchinput