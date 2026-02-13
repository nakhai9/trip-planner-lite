const express = require("express");
const { create } = require("../controllers/plan");
const router = express.Router();

router.post("/", create)

module.exports = router;
