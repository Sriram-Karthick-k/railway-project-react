import React, { useState, useEffect } from "react"
import {
    Redirect
} from "react-router-dom";
import axios from "axios"
function Notprotected(props) {
    const auth = JSON.parse(localStorage.getItem("userData"))
    useEffect(() => {
        axios
            .get("/isAuth", { headers: { "x-access-token": localStorage.getItem("token") } })
            .then(res => {
                console.log(res.data)
                if (res.data.loggedIn === true) {
                    window.location = "/"
                }
            })

    }, [])
    return <div>{!auth ? <props.component /> : <Redirect to="/" />}</div>
}
export default Notprotected