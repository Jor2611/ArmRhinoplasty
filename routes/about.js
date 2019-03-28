const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about", { active_about: true });
});
router.get("/history", (req, res) => {
  res.render("about-history", { active_about: true });
});
router.get("/mission", (req, res) => {
  res.render("about-mission", { active_about: true });
});
router.get("/board-of-directors", (req, res) => {
  res.render("about-bod", { active_about: true });
});
// Committees
router.get("/commitees", (req, res) => {
  res.render("about-commitees", { active_about: true, active_member: true });
});
router.get("/commitees/education", (req, res) => {
  res.render("about-committee-ed", { active_about: true, active_educ: true });
});
router.get("/commitees/website", (req, res) => {
  res.render("about-committee-website", {
    active_about: true,
    active_web: true
  });
});
router.get("/commitees/ethical", (req, res) => {
  res.render("about-committee-eth", { active_about: true, active_eth: true });
});
router.get("/commitees/nominating", (req, res) => {
  res.render("about-committee-nominating", {
    active_about: true,
    active_nominate: true
  });
});
router.get("/commitees/research", (req, res) => {
  res.render("about-committee-research", {
    active_about: true,
    active_research: true
  });
});
router.get("/commitees/strategic-planning", (req, res) => {
  res.render("about-committee-sp", { active_about: true, active_sp: true });
});
// End Committees
router.get("/members", (req, res) => {
  res.render("about-members", { active_about: true });
});

router.get("/new-bylaws", (req, res) => {
  res.render("about-nb", { active_about: true });
});

module.exports = router;
