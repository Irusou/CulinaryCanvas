const express = require("express");
const router = express.Router();
const typeController = require("../controllers/typeController");

router.get("/", typeController.getTypes);

router.get("/:id", typeController.getType);

router.post("/", typeController.addType);

router.delete("/:id", typeController.deleteType);

router.put("/:id", typeController.updateType);

module.exports = router;
