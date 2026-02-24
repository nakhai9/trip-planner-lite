const express = require("express");
const { get } = require("../controllers/svgVectorMap");
const router = express.Router();

router.get("/:codeName", get)

module.exports = router;
