const nodemailer = require("nodemailer")
//nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Your name",
    pass: "Your password"
  }
})

module.exports=transporter
