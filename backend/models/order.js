"use strict";
const connection = require("./connection");

module.exports = class Order {
	static async getOrder(id) {
		const query = `
      select p.description as 'Produto', quantity as 'Quantidade'
      from produto p inner join pedido pm on p.id = pm.produto
        inner join mesa m on pm.mesa = m.id
      where pm.mesa = ?;
    `;
		const order = await connection.execute(query, [id]);
		return order;
	}

	static async addToOrder(table) {
		const { id, product, quantity } = table;

		const existingProduct = await connection.execute();
	}

	static async updateOrder(order) {
		return order;
	}

	static async deleteOrder(id) {
		const query = "delete from pedido where id = ?";
		const [order] = await connection.execute(query, [id]);
		return order;
	}
};

async function checkIfOrderHasProductQuery(product) {
	const query = `select * from pedido where produto = ?`;
	const [product] = connection.execute(query, [product.id]);

	return product;
}
