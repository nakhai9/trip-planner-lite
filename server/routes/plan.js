const express = require("express");
const { create, get } = require("../controllers/plan");
const router = express.Router();

router.post("/", create)
// router.get("/:id", get)
router.post("/:id", get)

module.exports = router;
