const express = require("express");
const { create } = require("../controllers/planItinerary");
const router = express.Router();

router.post("/", create)
// router.get("/:id", get)
// router.post("/:id", getByPlanId)

module.exports = router;
