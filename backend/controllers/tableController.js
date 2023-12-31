const tableModel = require("../models/tableModel");

module.exports = class TableController {
	static async getAllTables(req, res) {
		const tables = await tableModel.getAllTables();

		return res.status(200).json(tables);
	}

	static async getTable(req, res) {
		const { id } = req.params;
		const table = await tableModel.getTable(id);

		return res.status(201).json(table);
	}

	static async getTableProducts(req, res) {}

	static async addProduct(req, res) {}

	static async updateProduct(req, res) {}

	static async deleteProduct(req, res) {}
};
