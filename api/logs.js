const { Router } = require("express");
const router = Router();
const LogEntry = require("../models/LogEntry");

router.get("/", async (req, res) => {
  try {
    const entries = await LogEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const entry = new LogEntry(req.body);
    const createdEntry = await entry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;
