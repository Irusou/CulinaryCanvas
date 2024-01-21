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

	static async addToOrder(id, table) {
		const { product, quantity: quantidade } = table;
		const [products] = await connection.execute(
			"select produto from pedido where mesa = ?",
			[id]
		);
		let query;
		let newProduct;
		if (products.some((p) => p.produto === product) === false) {
			query = "insert into pedido(mesa, produto, quantity) values(?,?,?)";
			[newProduct] = await connection.execute(query, [id, product, quantidade]);
		} else {
			let [oldQuantity] = await connection.execute(
				"select quantity from pedido where mesa = ? and produto = ?",
				[id, product]
			);
			let newQuantity = oldQuantity[0].quantity + quantidade;
			query = "update pedido set quantity = ? where mesa = ? and produto = ?";
			[newProduct] = await connection.execute(query, [
				newQuantity,
				id,
				product,
			]);
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
