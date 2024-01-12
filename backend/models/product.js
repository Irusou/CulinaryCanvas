"use strict";
const connection = require("./connection");

module.exports = class Product {
	static async getProducts() {
		const query = `select 
		p.description as 'Produto',
		round(p.price,2) as 'Preço',
		t.description as 'Tipo' 
		from produto p inner join tipo t on p.tipo = t.id;`;
		const [products] = await connection.execute(query);
		return products;
	}

	static async getProduct(id) {
		const query = `select 
		p.description as 'Produto',
		round(p.price,2) as 'Preço',
		t.description as 'Tipo' 
		from produto p inner join tipo t on p.tipo = t.id
		where p.id = ?;`;
		const [product] = await connection.execute(query, [id]);
		return product;
	}

	static async addProduct(product) {
		const { description, price, tipo } = product;
		const query = "insert into produto(description, price, tipo) values(?,?,?)";
		const [novoProduto] = await connection.execute(query, [
			description,
			price,
			tipo,
		]);
		return novoProduto;
	}

	static async updateProduct(product) {
		const { id, nome, preco } = product;
		const query =
			"UPDATE produto SET description = ?, price = ?, tipo = ? WHERE id = ?";
		const oldProduct = await connection.execute(query, [nome, preco, id]);
		return oldProduct;
	}

	static async deleteProduct(id) {
		const [product] = await connection.execute(
			"delete from produto WHERE id = ?",
			[id]
		);
		return product;
	}
};
