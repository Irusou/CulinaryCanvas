const tableModel = require("../models/table");

class TableController {
	static getTables = async (_req, res) => {
		const tables = await tableModel.getTables();

		return res.status(200).json(tables);
	};

	static updateTable = async (req, res) => {
		const { id } = req.params;
		const table = await tableModel.updateTable(id);

		return res.status(200).json(table);
	};
}

module.exports = TableController;
