const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/env");
const nodemailer = require("nodemailer");
const mailtemplate = require("./mail");

//Transporter Configuration
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.ACCOUNT_NAME,
    pass: config.ACCOUNT_PASS
  }
});

//Registration Route
router.post("/register", (req, res, next) => {
  let newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    date_of_birth: req.body.date_of_birth,
    country: req.body.nationality,
    degree: req.body.academic_degree,
    occupation_discipline: req.body.occupation_discipline,
    phone: req.body.phone,
    mobile_phone: req.body.mobile_phone,
    fax: req.body.fax,
    business_address: req.body.business_address,
    private_address: req.body.private_address,
    practice_details: req.body.practice_details,
    member_type: req.body.member_type,
    isAgree: req.body.agreement,
    password: req.body.password
  });

  if (req.body.confirm === newUser.password && newUser.isAgree === true) {
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
                let link =
                  "http://medicin.herokuapp.com/auth/Email_Verification=true?token=" +
                  doc.activation_Token;
                let mailOptions = {
                  from: '"Rhinoplasty Society" <rhinoplastyarm@gmail.com>', // sender address
                  to: req.body.email, // list of receivers
                  subject: "Account Activation", // Subject line
                  html: mailtemplate.activation(
                    link,
                    "Activate Account",
                    doc.first_name
                  )
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

//Authentication Route
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

//Email Verification Route
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

//Password resetting section
router.post("/forgetPassword", (req, res) => {
  let email = req.body.email;
  if (email !== "" && email !== undefined && email !== null) {
    User.findOne({ email }, (err, doc) => {
      if (err) return res.json({ success: false, msg: "Error: " + err });
      else if (!doc)
        return res.json({ success: false, msg: "Cannot find user" });
      else {
        let token = jwt.sign({ email: doc.email }, config.RESET_JWT_SECRET, {
          expiresIn: 904
        });
        let link =
          "http://medicin.herokuapp.com/auth/resetPassword?token=" + token;
        let mailOptions = {
          from: '"Rhinoplasty Society" <rhinoplastyarm@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
          html: mailtemplate.reset(
            link,
            "Reset Password",
            doc.first_name,
            doc.email
          )
        };
        transporter.sendMail(mailOptions, (errors, info) => {
          if (errors) {
            return console.log(errors);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
          res.status(201).json({ success: true, msg: "Good Very good" });
        });
      }
    });
  } else {
    res.status(403).json({ success: false, msg: "Please insert valid email" });
  }
});

router.get("/resetPassword", (req, res) => {
  let token = req.query.token;
  jwt.verify(token, config.RESET_JWT_SECRET, (err, data) => {
    if (err) res.redirect("/");
    else {
      User.findOne({ email: data.email }, (error, success) => {
        if (error) return res.json({ success: false, msg: "Error:" + error });
        else if (!success)
          return res.json({ success: false, msg: "Cannot get user link" });
        else {
          let url = `/auth/resetPassword?token=${success.activation_Token}`;
          res.render("resetPassword", { url });
        }
      });
    }
  });
});

router.post("/resetPassword", (req, res) => {
  let token = req.query.token;
  let { forgot_password, forgot_confirm } = req.body;
  if (forgot_confirm === forgot_password) {
    User.changePassword(token, forgot_password, (err, success) => {
      if (err) {
        let mailOptions = {
          from: '"Rhinoplasty Society" <rhinoplastyarm@gmail.com>', // sender address
          to: success.email, // list of receivers
          subject: "Password recovery", // Subject line
          html: mailtemplate.error(success.first_name, success.email)
        };
        transporter.sendMail(mailOptions, (errors, info) => {
          if (errors) {
            return console.log(errors);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
          res.redirect("/");
        });
      } else {
        let mailOptions = {
          from: '"Rhinoplasty Society" <rhinoplastyarm@gmail.com>', // sender address
          to: success.email, // list of receivers
          subject: "Password recovery", // Subject line
          html: mailtemplate.success(success.first_name, success.email)
        };
        transporter.sendMail(mailOptions, (errors, info) => {
          if (errors) {
            return console.log(errors);
          }
          console.log("Message %s sent: %s", info.messageId, info.response);
          res.redirect("/");
        });
      }
    });
  }
});

//Sign Out Route
router.get("/signOut", (req, res) => {
  res.clearCookie("id_cook");
  res.redirect("/");
});

module.exports = router;
