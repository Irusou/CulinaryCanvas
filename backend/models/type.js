"use strict";
const connection = require("./connection");

module.exports = class Type {
	static async getTypes() {
		const [types] = await connection.execute("SELECT * FROM tipo");
		return types;
	}

	static async getType(id) {
		const [type] = await connection.execute("SELECT * from tipo WHERE id = ?", [
			id,
		]);
		return type;
	}

	static async addType(type) {
		const { description } = type;
		const query = "insert into tipo(description) values(?)";
		const [newType] = await connection.execute(query, [description]);
		return newType;
	}

	static async updateType(type) {
		const { id, description } = type;
		const query = "UPDATE tipo SET description = ? WHERE id = ?";
		const oldType = await connection.execute(query, [description, id]);
		return oldType;
	}

	static async deleteType(id) {
		const [type] = await connection.execute("delete from tipo WHERE id = ?", [
			id,
		]);
		return type;
	}
};
