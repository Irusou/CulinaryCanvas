const productModel = require("../models/product");

class ProductController {
	static getProducts = async (_req, res) => {
		const products = await productModel.getProducts();

		return res.status(200).json(products);
	};

	static getProduct = async (req, res) => {
		const { id } = req.params;
		const product = await productModel.getProduct(id);

		return res.status(201).json(product);
	};

	static addProduct = async (req, res) => {
		const product = await productModel.addProduct(req.body);
		return res.status(201).json(product);
	};

	static updateProduct = async (req, res) => {
		const product = await productModel.updateProduct(req.body);
		return res.status(201).json(product);
	};

	static deleteProduct = async (req, res) => {
		const { id } = req.params;
		const product = await productModel.deleteProduct(id);

		return res.status(201).json(product);
	};
}

module.exports = ProductController;
