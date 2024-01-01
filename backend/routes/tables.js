const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// returns all the tables
router.get("/", tableController.getAllTables);

// returns a single table
router.get("/:id", tableController.getTable);

// returns the products of a table
router.get("/:id", tableController.getTableProducts);

// adds a product to a table
router.post("/", tableController.addProduct);

// deletes a product from a table
router.delete("/:id", tableController.deleteProduct);

// updates a product of a table
router.put("/", tableController.updateProduct);

module.exports = router;
