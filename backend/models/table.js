const connection = require("./connection");

module.exports = class Table {
	static async getTables() {
		const [tables] = await connection.execute("SELECT * FROM mesa");
		return tables;
	}

	static async updateTable(id) {
		const [table] = await connection.execute(
			"update mesa set isOpen = false WHERE id = ?",
			[id]
		);
		return table;
	}
};
