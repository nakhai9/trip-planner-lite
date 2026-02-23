const express = require("express");
const router = express.Router();
const { get } = require("../controllers/province");

router.get('/', get);

module.exports = router