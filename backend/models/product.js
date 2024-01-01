"use strict";
const connection = require("./connection");

module.exports = class Product {
	static async getProducts() {
		const [products] = await connection.execute("SELECT * FROM produto");
		return products;
	}

	static async getProduct(id) {
		const [product] = await connection.execute(
			"SELECT * from produto WHERE produto_id = ?",
			[id]
		);
		return product;
	}

	static async addProduct(product) {
		const { nome, preco } = product;
		console.log(product);
		const query =
			"insert into produto(produto_nome, produto_preco) values(?,?)";
		const [novoProduto] = await connection.execute(query, [nome, preco]);
		return novoProduto;
	}

	static async updateProduct(product) {
		const { id, nome, preco } = product;
		const query =
			"UPDATE produto SET produto_nome = ?, produto_preco = ? WHERE produto_id = ?";
		const oldProduct = await connection.execute(query, [nome, preco, id]);
		return oldProduct;
	}

	static async deleteProduct(id) {
		const [product] = await connection.execute(
			"delete from produto WHERE produto_id = ?",
			[id]
		);
		return product;
	}
};
