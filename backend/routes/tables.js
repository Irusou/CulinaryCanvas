const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// returns all tables
router.get("/", tableController.getTables);

// updates the state of a table
router.put("/:id", tableController.updateTable);

module.exports = router;
