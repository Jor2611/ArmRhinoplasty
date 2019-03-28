const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const conf = require("./config/env");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/db");
const auth = require("./routes/auth");
const about = require("./routes/about");
const rhinoplasty = require("./routes/rhinoplasty");
let app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: conf.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.engine("handlebars", exphbs({ defaultLayout: "index" }));
app.set("view engine", "handlebars");
app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/home", (req, res) => {
  if (req.cookies.id_cook) {
    res.render("home", { active_home: true, toggle: true });
  } else {
    res.render("home", { active_home: true, toggle: false });
  }
});
app.use("/about", about);
app.use("/rhinoplasty", rhinoplasty);
app.get("/president-message", (req, res) => {
  res.render("president-message", { active_home: true });
});
app.get("/imrhis", (req, res) => {
  res.render("imrhis", { active_home: true });
});
app.get("/findSurgeon", (req, res) => {
  res.render("surgeon", { active_surg: true });
});
app.get("/meetings", (req, res) => {
  res.render("meeting", { active_meet: true });
});
app.get("/events", (req, res) => {
  res.render("events", { active_event: true });
});
app.get("/links", (req, res) => {
  res.render("links", { active_link: true });
});
app.get("/officalJournal", (req, res) => {
  res.render("journal", { active_offical: true });
});
app.get("/register", (req, res) => {
  if (!req.cookies.id_cook) {
    res.render("register", { active_sign: true });
  } else {
    res.redirect("/");
  }
});

app.use("/auth", auth);

app.listen(conf.PORT, () => {
  console.log(`Server running on port ${conf.PORT}`);
});
