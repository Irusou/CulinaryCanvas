const connection = require("./connection");

module.exports = class Table {
	static async getAllTables() {
		const [tables] = await connection.execute("SELECT * FROM mesa");
		return tables;
	}

	static async getTable(id) {
		const [table] = await connection.execute(
			"SELECT * from mesa WHERE id = ?",
			[id]
		);
		return table;
	}

	static async addProduct(id, product) {}
};
