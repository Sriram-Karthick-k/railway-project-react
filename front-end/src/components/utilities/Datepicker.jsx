import React, { useState } from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function Datepicker(props) {
  var [selectedDate, setSelectedDate] = useState(null)
  return (
    <DatePicker
      selected={selectedDate}
      onChange={e => { setSelectedDate(e); }}
      name={props.name}
      value={props.value}
      id="date"
      // onChangeRaw={event => { props.onchange(event) }}
      minDate={new Date()}
      className='form-control'
      placeholderText='Journey Date'
      closeOnScroll={props.closeonscroll}
      dateFormat="dd/MM/yyyy"
      format='dd-MM-dd'
      autoComplete="off"
    />
  );
}
export default Datepicker