import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Notprotected from "./Notprotected"
import Signup from "./Signup"
import Notfound from "./Notfound"
import Signin from "./Signin"
import Forgot from "./Forgot"
import Index from "./Index"
import Findtrains from "./Findtrains"
import BookTickets from "./BookTickets"
import Protected from "./Protected"
import Bookticektprocess from "./BookTicketprocess"
import Admin from "./Admin"
import BookedTickets from "./BookedTickets"
function Routes() {

  return (
    <Router >
      <Switch >
        <Route exact path="/sign-up" ><Notprotected component={Signup} /></Route>
        <Route exact path="/admin" ><Notprotected component={Admin} /></Route>
        <Route exact path="/sign-in" ><Notprotected component={Signin} /></Route>
        <Route exact path="/forgot" component={Forgot} />
        <Route exact path="/book-tickets"><Protected component={BookTickets} /></Route>
        <Route exact path="/process"><Protected component={Bookticektprocess} /></Route>
        <Route exact path="/find-trains" ><Protected component={Findtrains} /></Route>
        <Route exact path="/booked-tickets" ><Protected component={BookedTickets} /></Route>
        <Route exact path="/" ><Protected component={Index} /></Route>
        <Route component={Notfound} />
      </Switch >
    </Router>
  )
}
export default Routes
