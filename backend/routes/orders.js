const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/:table", orderController.getOrder);

router.put("/:id", orderController.updateOrder);

router.post("/:table", orderController.addToOrder);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
