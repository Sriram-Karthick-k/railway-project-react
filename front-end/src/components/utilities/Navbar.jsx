import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2'
function Navbar(props) {
  var [responsive, setResponsive] = useState({ class: "topnav copy-text", onClick: "float-right", icon: "fa fa-bars", z_index: "" })
  function handleClick() {
    if (responsive.class === "topnav copy-text") {
      setResponsive({ class: "topnav responsive", onClick: "", icon: "fa fa-times", z_index: "navbar-responsive" })
    } else {
      setResponsive({ class: "topnav copy-text", onClick: "float-right", icon: "fa fa-bars", z_index: "" })
    }
  }
  function logout() {
    Swal.fire({
      title: 'Do you want to go to sign-in page?',
      text: "You will be logged out from Your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2bc20e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      customClass: {
        container: "copy-text"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/logout")
          .then(res => {
            if ((res.data.loggedIn !== false)) {

            } else {
              localStorage.clear()
              window.location = "sign-in"
            }
          }, [])
          .catch(err => {
            console.log(err)
          })
      }
    })
  }
  return (
    <div className={responsive.z_index}>
      <div className={responsive.class} id="myTopnav">
        <Link to="#" className="icon" onClick={handleClick}>
          <i className={responsive.icon}></i>
        </Link>
        <Link className="navbar-brand" to="/">
          <img src="/images/pageLogo.png" width="30" height="30" className="d-inline-block nav-image" alt="logo" loading="lazy" />
          Railway
      </Link>
        <div className={responsive.onClick}>
          <Link to="/" className={props.active === "home" ? "active" : ""}>Home</Link>
          <Link to="#pnr">PNR Status</Link>
          <Link to="/find-trains" className={props.active === "find-trains" ? "active" : ""}>Find trains</Link>
          <Link to="/booked-tickets" className={props.active === "book-ticket" ? "active" : ""} >Booked Tickets</Link>
          <Link to="#cancleTickets">Cancle Tickets</Link>
          <Link to="#Profile">Profile</Link>
          < Link to="#" className="logout" onClick={logout}>Logout</Link>
        </div>
      </div>
    </div>

  )
}
export default Navbar