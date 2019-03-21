const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/env");
const nodemailer = require("nodemailer");

router.post("/register", (req, res, next) => {
  let newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  if (req.body.confirm === newUser.password) {
    User.getUserByEmail(newUser.email, (err, match) => {
      if (err) return res.json({ success: false, msg: "Error: " + err });
      else if (!match) {
        User.addUser(newUser, (error, doc) => {
          if (error)
            return res.json({ success: false, msg: "Error: " + error });
          else if (!doc)
            return res.json({
              success: false,
              msg: "Something went wrong with registration"
            });
          else {
            let payload = {
              fname: doc.first_name,
              lname: doc.last_name,
              email: doc.email
            };
            let token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: 60 });
            User.updateToken(doc.email, token, (bad, good) => {
              if (bad)
                return res.json({ success: false, msg: "Error: " + bad });
              else {
                let transporter = nodemailer.createTransport({
                  service: "Gmail",
                  auth: {
                    user: config.ACCOUNT_NAME,
                    pass: config.ACCOUNT_PASS
                  }
                });
                let link =
                  "http://medicin.herokuapp.com/auth/Email_Verification=true?token=" +
                  doc.activation_Token;
                let mailOptions = {
                  from: '"ArmRhinoplasty"<Rhinoplastyarm@gmail.com>', // sender address
                  to: req.body.email, // list of receivers
                  subject: "Account Activation", // Subject line
                  html: `For activating your account please follow this link <a href="${link}">Activate My Account</a>`
                };
                transporter.sendMail(mailOptions, (errors, info) => {
                  if (errors) {
                    return console.log(errors);
                  }
                  console.log(
                    "Message %s sent: %s",
                    info.messageId,
                    info.response
                  );
                  res.cookie("id_cook", token);
                  res.json({ success: true, msg: "Good Very good" });
                });
              }
            });
          }
        });
      } else {
        return res.json({ success: false, msg: "User Already Exists" });
      }
    });
  } else {
    return res.json({ success: false, msg: "Passwords do not match" });
  }
});

router.post("/authenticate", (req, res) => {
  let email = req.body.email;
  let password = req.body.dassword;

  User.getUserByEmail(email, (err, success) => {
    if (err) return res.json({ success: false, msg: "Error: " + err });
    else if (!success)
      return res.json({ success: false, msg: "User does not exist" });
    else {
      User.comparePassword(password, success.password, (error, doc) => {
        if (error) return res.json({ success: false, msg: "Error: " + error });
        else if (!doc)
          return res.json({ success: false, msg: "Wrong Password" });
        else {
          let payload = {
            fname: success.first_name,
            lname: success.last_name,
            email: success.email
          };

          let token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: 60 });
          User.updateToken(success.email, token, (bad, good) => {
            if (bad) return res.json({ success: false, msg: "Error: " + bad });
            else {
              res.cookie("id_cook", token);
              res.json({ success: true, msg: "Good Very good" });
            }
          });
        }
      });
    }
  });
});

router.get("/Email_Verification=true", (req, res) => {
  let activation_Token = req.query.token;
  User.findOneAndUpdate(
    { activation_Token },
    { isActive: true },
    (err, success) => {
      if (err) return res.status(400).send("Something went wrong");
      else if (!success) return res.status(404).send("Maybe token expired");
      else res.redirect("/");
    }
  );
});

router.get("/signOut", (req, res) => {
  res.clearCookie("id_cook");
  res.redirect("/");
});

module.exports = router;
