const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("rhinoplasty", { active_rhin: true });
});

router.get("/main", (req, res) => {
  res.render("rhinoplasty-main", { active_rhin: true });
});

router.get("/secondary", (req, res) => {
  res.render("rhinoplasty-secondary", { active_rhin: true });
});

module.exports = router;
