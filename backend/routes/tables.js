const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// returns all the tables
router.get("/", tableController.getTables);

// updates a product of a table
router.put("/:id", tableController.updateTable);

module.exports = router;
