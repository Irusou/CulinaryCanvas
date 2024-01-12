"use strict";
const connection = require("./connection");

module.exports = class Order {
	static async getOrder(id) {
		const query = `
	    select pm.mesa as 'Mesa', p.description as 'Produto', quantity as 'Quantidade'
	    from produto p inner join pedido pm on p.id = pm.produto
	      inner join mesa m on pm.mesa = m.id
	    where pm.mesa = ?;
	  `;
		const [order] = await connection.execute(query, [id]);
		return order;
	}

	static async addToOrder(table) {
		const { id, product, quantity } = table;
		const [products] = await connection.execute(
			"select produto from pedido where mesa = ?",
			[id]
		);

		let query;
		let [newProduct] = [];
		if (products.indexOf(product) === -1) {
			query = "insert into pedido(mesa, produto, quantity) values(?,?,?)";
			[newProduct] = connection.execute(query, [id, product, quantity]);
		} else {
			query = "update pedido set quantity = ? where mesa = ?";
			[newProduct] = connection.execute(query, [++quantity, id]);
		}
		return newProduct;
	}

	static async updateOrder(id, order) {
		const { table, product, quantity } = order;
		const query = `
      UPDATE pedido SET mesa = ?, produto = ?, quantity = ? WHERE id = ?
    `;
		const [oldOrder] = await connection.execute(query, [
			table,
			product,
			quantity,
			id,
		]);
		return oldOrder;
	}

	static async deleteOrder(id) {
		const query = "delete from pedido where id = ?";
		const [order] = await connection.execute(query, [id]);
		return order;
	}
};
