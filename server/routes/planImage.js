const express = require("express");
const router = express.Router();
const { create } = require("../controllers/planImage");

router.post('/', create);

module.exports = router