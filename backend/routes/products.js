const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// returns all the products
router.get("/", productController.getProducts);

// returns a single product
router.get("/:id", productController.getProduct);

// adds a product
router.post("/", productController.addProduct);

// deletes a product
router.delete("/:id", productController.deleteProduct);

// updates a product
router.put("/", productController.updateProduct);

module.exports = router;
