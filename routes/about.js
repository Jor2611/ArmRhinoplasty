const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about", { active_about: true });
});
router.get("/history", (req, res) => {
  res.render("about-history", { active_about: true });
});

module.exports = router;
