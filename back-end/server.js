const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const BInfo = require("./mongodb/BookingInfos.js")
const TInfo = require("./mongodb/Trainsinfos.js")
const SchedulesInfos = require("./mongodb/SchedulesInfos.js")
const StationsInfos = require("./mongodb/StationsInfos.js")
const UserInfo = require("./mongodb/UserINfos.js")
const transporter = require("./functions/mailer.js")
const bcrypt = require("bcrypt");
var cors = require('cors')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const jwt = require("jsonwebtoken")
const { query } = require("express")
const Trainsinfos = require("./mongodb/Trainsinfos.js")
//config
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(session({
  key: "userId",
  secret: "SECRET",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24 * 1000
  }
}))


//sign-up
app.post("/sign-up", async function (req, res) {
  var data = req.body
  var out = {
    mail: [0, ""],
    userName: [0, ""],
    password: [0, ""],
    confirmPassword: [0, ""]
  }
  var found = await UserInfo.find({ mailId: req.body.mail }).exec()
  if (found.length != 0) {
    out.mail = [1, "The mail is already exists"]
  }
  var found = await UserInfo.find({ userName: req.body.userName }).exec()
  if (found.length != 0) {
    out.userName = [1, "The user name already exists"]
  }
  if (req.body.password.length < 8) {
    out.password = [1, "The password must atleast contains 8 characters."]
  }
  var dummy = 0
  if (out.password[0] == 0) {
    passLength(req.body.password) ? dummy = 1 : out.password = [1, "The password should contain atleast one character, one upper letter, one lower letter and one number."]
  }
  var compare = comparing(req.body.password, req.body.confirmPassword) ? dummy = 1 : out.confirmPassword = [1, "The password and confirm password should be same."]
  if (out.mail[0] != 0 || out.userName[0] != 0 || out.password[0] != 0 || out.confirmPassword[0] != 0) {
    res.json(out)
  } else {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    var verificatinNumber = verify(6)
    var mailOptions = {
      from: "Your mailId",
      to: req.body.mail,
      subject: "verfication code",
      html: "<h4>Hi " + req.body.userName + ", Thanks for signing in with Railway,Your verification number is " + verificatinNumber + "<h4>"
    };
    sendMail(mailOptions)
    var create = new UserInfo({
      userName: req.body.userName,
      mailId: req.body.mail,
      password: hashedPassword,
      wrongAttemp: 5,
      lock: "NO",
      verification: [verificatinNumber, "NO"],
      BookingDetails: []
    })
    create.save()
    res.json(null)
  }
})
//Forgot
app.post("/forgot", async function (req, res) {
  var found = await UserInfo.find({ mailId: req.body.mail }).exec()
  var out = { mail: [0, ""], reset: [0, ""], password: [0, ""], confirmPassword: [0, ""] }
  if (found.length == 0) {
    out.mail = [1, "The mail is not found"]
    res.json(out)
  } else {
    var verfication = verify(6)
    var mailOptions = {
      from: "Your mailId",
      to: req.body.mail,
      subject: "Reset code",
      html: "<h4>Your code for password reset is : " + verfication + "<h4>"
    };
    sendMail(mailOptions)
    await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { oneTimePassword: verfication } }).exec()
    res.json(null)
  }
})
//logout
app.post("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) console.log(err)
    else {
      res.send({ loggedIn: false })
    }
  })
})

//Reset
app.post("/reset", async function (req, res) {
  var found = await UserInfo.find({ mailId: req.body.mail }).exec()
  var out = { mail: [1, req.body.mail], reset: [0, ""], password: [0, ""], confirmPassword: [0, ""] }
  if (String(found[0].oneTimePassword) != String(req.body.reset)) {
    out.reset = [1, "The reset code didn't match"]
  }
  if (req.body.password.length < 8) {
    out.password = [1, "The password must atleast contains 8 characters."]
  }
  var dummy = 0
  if (out.password[0] == 0) {
    passLength(req.body.password) ? dummy = 1 : out.password = [1, "The password should contain atlease one character, one upper letter, one lower letter and one number."]
  }
  var compare = comparing(req.body.password, req.body.confirmPassword) ? dummy = 1 : out.confirmPassword = [1, "The password and confirm password should be same."]
  if (out.mail[0] != 1 || out.reset[0] != 0 || out.password[0] != 0 || out.confirmPassword[0] != 0) {
    res.json(out)
  } else {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { oneTimePassword: "", password: hashedPassword, lock: "NO", wrongAttemp: 5, } }).exec()
    res.json(null)
  }
})

//sign-in
app.post("/sign-in", async function (req, res) {
  var found = await UserInfo.find({ mailId: req.body.mail }).exec()
  var out = { auth:false, mail: [0, ""], password: [0, ""], userName: false }
  if (found.length === 0) {
    out.mail = [1, "Invalid Email address"]
  } else {
    if (await bcrypt.compare(req.body.password, found[0].password)) {
      if (found[0].lock == "YES") {
        out.password = [1, "Your account is locked, Please reset your password."]
      }else{
        await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { wrongAttemp: 5 } }).exec()
        const id = found[0]._id
        const token = jwt.sign({ id }, "jwtSecret", {
          expiresIn: 3600 * 24
        })
        req.session.user = found[0]
        res.json({ auth: true, token: token, user: { loggedIn: true, userName: req.session.user.userName, mail: req.session.user.mailId, verification: req.session.user.verification } })
      }
    } else {
      if (found[0].lock == "YES") {
        out.password = [1, "Your account is locked, Please reset your password."]
      }
      if (found[0].wrongAttemp === 0) {
        await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { lock: "YES" } }).exec()
        out.password = [1, "Your account is locked, Please reset your password."]
      } else {
        await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { wrongAttemp: (found[0].wrongAttemp - 1) } }).exec()
        out.password = [1, "Password and user name doesn't match.The attempts remaining is " + (found[0].wrongAttemp - 1)]
      }
    }
  }
  try {
    res.send(out)
  } catch (error) {
    console.log(error)
  }
})
function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"]

  if (!token) {
    res.json({ loggedIn: false })
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ loggedIn: false })
      } else {
        req.userId = decoded.id
        next();
      }
    })
  }
}

//islogged in
app.get("/logged-in", async function (req, res) {
  //var found=var found = await UserInfo.find({mailId:req.session.user.mailId}).exec()
  if (req.session.user) {
    res.send({ loggedIn: true, userName: req.session.user.userName, mail: req.session.user.mailId, verification: req.session.user.verification })
  } else {
    res.send({ loggedIn: false })
  }
})
app.get("/isAuth", verifyJWT, function (req, res) {
  res.json({ loggedIn: true })
})

//verification
app.post("/verification", async function (req, res) {
  var found=    await UserInfo.findOne({ mailId: req.body.mail }).exec()
  try {
    await UserInfo.findOneAndUpdate({ mailId: req.body.mail }, { $set: { verification: [found.verification[0], "YES"] } }).exec()
  } catch (e) {
    console.log(e)
  }
  res.json({ auth: true, user: { loggedIn: true, userName: found.userName, mail: found.mailId, verification: [found.verification[0],"YES"] } })
})
//verification
app.get("/autocomplete", async function (req, res) {
  var search = req.query.search.toUpperCase()
  StationsInfos.find({
    "station_code": {
      $regex: search
    }
  }, {
    _id: 0,
    _v: 0
  }, function (err, code) {
    if (err) console.log(err);
    else {
      StationsInfos.find({
        "station_name": {
          $regex: search
        }
      }, {
        _id: 0,
        _v: 0
      }, function (err, result) {
        if (err) console.log(err);
        else {
          out = []
          if (code != null) {
            for (var i = 0; i < code.length; i++) {
              var sample = code[i].station_code.slice(0, search.length)
              if (sample.toUpperCase() == search) {
                var lable_out = code[i].station_name + " - " + code[i].station_code
                out.push({
                  label: lable_out
                });
              }
            }
          }
          if (result === null) {
            res.jsonp(out)
          } else {
            for (var i = 0; i < result.length; i++) {
              var sample = result[i].station_name.slice(0, search.length)
              if (sample.toUpperCase() == search) {
                var lable_out = result[i].station_name + " - " + result[i].station_code
                out.push({
                  label: lable_out
                });
              }
            }
            res.jsonp(out)
          }
        }
      });
    }
  });
})

app.get("/book-tickets", function (req, res) {
  var from_station = req.query.from
  var to_station = req.query.to
  var date = req.query.date
  var From = from_station.split(" - ")[0]
  var To = to_station.split(" - ")[0]
  StationsInfos.find({
    station_name: From
  }, function (err, from) {
    StationsInfos.find({
      station_name: To
    }, function (err, to) {
      TInfo.find({
        train_coordinates: {
          $all: [from[0].station_coordinates[0], to[0].station_coordinates[0]]
        }
      },async function (err, result) {

        if (err) {
          redirect("/")
        } else {
          var out = []
          var out2 = []
          for (var i = 0; i < result.length; i++) {
            if (result[i].from_station_name == From) {
              out.push(result[i])
            } else {
              var count = 0
              for (var j = 0; j < result[i].train_coordinates.length; j++) {
                if (result[i].train_coordinates[j] === to[0].station_coordinates[0]) {
                  count += 1
                  break
                }
                if (result[i].train_coordinates[j] === from[0].station_coordinates[0]) {
                  count += 1
                }
              }
              if (count > 1) {
                out2.push(result[i])
              }
            }
          }
          out = [out, out2]
          res.send(out)
        }
      })
    })
  })

})


app.get("/train-autocomplete", function(req, res) {
  var trainName = req.query.search;
  TInfo.find({
    "train_name": {
      $regex:trainName ,$options:"i"
    }
  }, {
    _id: 0,
    _v: 0
  }, function(err, result) {
    if (err) console.log(err);
    else {
      out = []
      if (result === null) {
        res.jsonp(out)
      } else {
        for (var i = 0; i < result.length; i++) {
          var sample = result[i].train_name
            var lable_out = result[i].train_name
            if(out.length!=100){
              out.push({
                label: lable_out
              });
            }
        }
        res.json(out)
      }
    }
  });
})

app.get("/find-trains",function(req,res){
    var trainName=req.query.trainName;
    SchedulesInfos.find({train_name:trainName},function(err,result){
      if(err) console.log(err);
      else{
        res.json(result)
      }
    })
})

app.get("/train-details",function(req,res){
  var trainName=req.query.trainName
  TInfo.findOne({train_name:trainName},function(err,result){
    if(err) console.log(err)
    else{
      res.send(result)
    }
  })
})

app.get("/train-availability",async function(req,res){
  var trainName=req.query.trainName
  var date=req.query.date
  BInfo.findOne({trainName:trainName,date:date},async function(err,result){
    if(err) console.log(err)
    else{
        var booking_details=result
        var from = await StationsInfos.findOne({station_name:req.query.from.split(" - ")[0]}).exec()
        var to =await StationsInfos.findOne({station_name:req.query.to.split(" - ")[0]}).exec()
        var stations=await TInfo.findOne({train_name:trainName}).exec()
        var waiting_tickets=result.waiting_tickets
        var from_index=stations.train_coordinates.indexOf(from.station_coordinates)
        var to_index=stations.train_coordinates.indexOf(to.station_coordinates)
        var out=[]
        for(var i=from_index;i<to_index;i++){
          out.push(result.remaining_seats[i])
        }
        console.log(result.remaining_seats)
        console.log(Math.min(...out))
        if(Math.min(...out)>0){
          res.send({trainSeatAvailable:Math.min(...out)})
        }else{
          res.send({trainSeatAvailable:"waiting list "+(waiting_tickets.length+1)})
        }
    }
  })
})

app.post("/ticket-booking-process",function(req,res){
  var passangerDetails=req.body
  BInfo.findOne({trainName:req.body.trainName,date:req.body.date},async function(err,result){
    if(err)console.log(err)
    else{
        var booking_details=result
        var from = await StationsInfos.findOne({station_name:req.body.from.split(" - ")[0]}).exec()
        var to =await StationsInfos.findOne({station_name:req.body.to.split(" - ")[0]}).exec()
        var stations=await TInfo.findOne({train_name:passangerDetails.trainName}).exec()
        var waiting_tickets=result.waiting_tickets
        var from_index=stations.train_coordinates.indexOf(from.station_coordinates)
        var to_index=stations.train_coordinates.indexOf(to.station_coordinates)
        var remaining_seats=booking_details.remaining_seats
        var booked_tickets=booking_details.booked_tickets
        console.log(remaining_seats)
        var out=[]
        for(var i=from_index;i<to_index;i++){
          for(var i=from_index;i<to_index;i++){
            out.push(result.remaining_seats[i])
          }
        }
          if(Math.min(...out)-passangerDetails.passangers.length>=0){
            
            for(var j=from_index;j<to_index;j++){ 
                remaining_seats[j]=remaining_seats[j]-passangerDetails.passangers.length
            }
            var userInfo=await  UserInfo.findOne({mailId:req.body.mail}).exec()
            var userBooking=userInfo.BookingDetails
            userBooking.push({from:req.body.from,to:req.body.to,passangers:passangerDetails.passangers,bookingStatus:"Confirmed",trainName:req.body.trainName,date:req.body.date,trainNumber:stations.train_number})
            booked_tickets.push({from:req.body.from,to:req.body.to,passangers:passangerDetails.passangers})
            await BInfo.findOneAndUpdate({trainName:req.body.trainName,date:req.body.date},{$set:{remaining_seats:remaining_seats,booked_tickets:booked_tickets}}).exec()
            await UserInfo.findOneAndUpdate({mailId:req.body.mail},{$set:{BookingDetails:userBooking}}).exec()
            res.send(true)
          }else{
          var userInfo=await  UserInfo.findOne({mailId:req.body.mail}).exec()
          var userBooking=userInfo.BookingDetails
          userBooking.push({from:req.body.from,to:req.body.to,passangers:passangerDetails.passangers,bookingStatus:"Not confirmed",trainName:req.body.trainName,date:req.body.date,trainNumber:stations.train_number})
          waiting_tickets.push({from:req.body.from,to:req.body.to,passangers:passangerDetails.passangers,mail:req.body.mail})
          await BInfo.findOneAndUpdate({trainName:req.body.trainName,date:req.body.date},{$set:{waiting_tickets:waiting_tickets}}).exec()
          await UserInfo.findOneAndUpdate({mailId:req.body.mail},{$set:{BookingDetails:userBooking}}).exec()
            res.send(true)
        }
    }
  })
})

app.post("/admin",async function(req,res){
  BInfo.findOne({trainName:req.body.trainName,date:req.body.date},async function(err,result){
    if(err) console.log(err)
    else{
      if(!result){
        var trainDetails= await TInfo.findOne({train_name:req.body.trainName})
        var stationLength=trainDetails.train_coordinates.length
        var bookedTickets=new Array(stationLength-1).fill(Number(req.body.capacity))
        var bookinginfo = new BInfo({
          totalSeats:req.body.capacity,
          date: req.body.date,
          trainName: req.body.trainName,
          booked_tickets: [],
          waiting_tickets: [],
          remaining_seats:bookedTickets
        })
        bookinginfo.save()
        res.send(true)
      }else{
        var booked_train_details=result
        var seatToBeFilled=Math.abs(booked_train_details.totalSeats-req.body.capacity)
        for(var i=0;i<booked_train_details.remaining_seats.length;i++){
          booked_train_details.remaining_seats[i]=Math.abs(booked_train_details.remaining_seats[i]+seatToBeFilled)
        }
        await BInfo.findOneAndUpdate({trainName:req.body.trainName,date:req.body.date},{$set:{remaining_seats:booked_train_details.remaining_seats,totalSeats:req.body.capacity}}).exec()
        res.send(true)
      }
    }
  })
  
})


app.get("/booking-history",async function(req,res){
  var booking_details=await UserInfo.findOne({userName:req.query.userName}).exec()
  res.send(booking_details.BookingDetails)
})


function passLength(password) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  var number = "1234567890";
  var characters = "abcdefghijklmnopqrstuvwxyz"
  var Ccharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  count = 0
  //password character checking
  if (format.test(password)) {
    count += 1
  }
  for (var i = 0; i < password.length; i++) {
    var key = count
    for (var j = 0; j < number.length; j++) {
      if (String(password[i]) === number[j]) {
        count += 1
        break
      }
    }
    if (key < count) {
      break
    }
  }
  for (var i = 0; i < password.length; i++) {
    var key = count
    for (var j = 0; j < characters.length; j++) {
      if (String(password[i]) === characters[j]) {
        count += 1
        break
      }
    }
    if (key < count) {
      break
    }
  }
  for (var i = 0; i < password.length; i++) {
    var key = count
    for (var j = 0; j < Ccharacters.length; j++) {
      if (String(password[i]) === Ccharacters[j]) {
        count += 1
        break
      }
    }
    if (key < count) {
      break
    }
  }
  if (count < 4) {
    return false
  } else {
    return true
  }
}
function comparing(str1, str2) {
  if (str1.localeCompare(str2) === 0) {
    return true
  } else {
    return false
  }
}
function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    }
  })
}
function verify(n) {
  var verificatinNumber = "";
  for (var i = 0; i < n; i++) {
    verificatinNumber += Math.floor(Math.random() * 10)
  }
  return verificatinNumber
}

app.listen(3001, function (req, res) {
  console.log("app is started");
})
