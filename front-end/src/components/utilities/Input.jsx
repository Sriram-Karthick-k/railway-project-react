import React from "react"

function Input(props) {
  var classname = "form-control " + props.class
  if (props.autofocus === "true") {
    return (
      <input list={props.list} autoComplete={props.autocomplete} value={props.value} onBlur={props.onblur} placeholder={props.placeHolder} onClose={props.onClose} id={props.id} className={classname} onChange={props.onchange} name={props.name} onClick={props.onclick} type={props.type} required autoFocus />
    )
  }
  if (props.autofocus === "false") {
    return (
      <input list={props.list} autoComplete={props.autocomplete} value={props.value} onBlur={props.onblur} placeholder={props.placeHolder} onClose={props.onClose} id={props.id} className={classname} onChange={props.onchange} name={props.name} onClick={props.onclick} type={props.type} required />
    )
  }
}
export default Input
