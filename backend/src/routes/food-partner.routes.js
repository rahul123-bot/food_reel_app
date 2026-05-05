const express = require("express");
const foodPartnerController = require("../controller/food-partner.controller.js")

const router = express.Router()

router.get("/:id",foodPartnerController.getFoodPartnerById);

module.exports = router;
