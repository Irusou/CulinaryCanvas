const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// returns all the tables
router.get("/", (_req, res) => tableController.getAllTables);

// returns a single table
router.get("/:id", (req, res) => tableController.getTable);

// returns the products of a table
router.get("/:id", (req, res) => tableController.getTableProducts);

// adds a product to a table
router.post("/", (req, res) => tableController.addProduct);

// deletes a product from a table
router.post("/:id", (req, res) => tableController.deleteProduct);

// updates a product of a table
router.post("/", (req, res) => tableController.updateProduct);

module.exports = router;
