const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("hello");
  res.json({ hi: "here" });
});

module.exports = router;
