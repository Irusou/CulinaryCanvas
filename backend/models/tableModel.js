const connection = require("./connection");

module.exports = class TableModel {
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

	static async addProduct(id, product) {
		const { pid } = product;
		const [product] = await connection.execute(
			"select * from produto where produto_id = ?",
			pid
		);

		await connection.execute(
			"INSERT INTO produtomesa(mesa_id, produto_id, quantidade) values(?,?,?)",
			[id, pid, 1]
		);
	}
};
