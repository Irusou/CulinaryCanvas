"use strict";

class Table {
	constructor(tableNumber) {
		this.tableNumber = tableNumber;
		this.products = [];
	}

	addProduct(product) {
		this.products.push(product);
	}

	removeProduct(product) {
		this.products.filter((p) => p !== product);
	}
}

function irParaHomePage() {
	window.location.href = "/frontend/index.html";
}

document.addEventListener("DOMContentLoaded", function () {
	const tablesContainer = document.getElementById("mesas-container");
	const mesasLink = document.getElementById("mesas-link");
	const productsContainer = document.getElementById("produtos-container");
	const produtosLink = document.getElementById("produtos-link");
	let formPedido = document.getElementById("order-form-container");
	let productForm = document.getElementById("product-form-container");
	let btnCriar = document.getElementById("btnCriar");
	let btnEditar = document.getElementById("btnEditar");
	let btnApagar = document.getElementById("btnApagar");
	let btnFechar = document.getElementById("btnFechar");

	let productSelect = document.getElementById("select-product");

	const totalMesas = 10;
	let tables = [];

	mesasLink.addEventListener("click", function (e) {
		exibirMesasLayout();
	});

	produtosLink.addEventListener("click", function (e) {
		exibirProdutosLayout();
	});

	//! -----------------------------------------------------------------------------------

	/**
	 * calcula o preço total de produtos de uma mesa
	 * @param {*} productList
	 * @returns preço total de produtos de uma mesa
	 */
	function calculateTotal(productList) {
		return productList.reduce((init, curr) => {
			return (init += curr.price);
		}, 0.0);
	}

	/**
	 * metodo auxiliar para atualizar a label do total de produtos de uma mesa
	 * @param {*} mesa
	 */
	function updateTotal(mesa) {
		let p = document.getElementById("label-total");
		let total = calculateTotal(mesa.products);
		p.replaceChildren();
		if (total > 0) {
			p.appendChild(document.createTextNode(`Total ${total} €`));
		}
	}

	function exibirMesasLayout() {
		tablesContainer.style.display = "block";
		productsContainer.style.display = "none";

		tablesContainer.replaceChildren();

		for (let i = 1; i <= totalMesas; i++) {
			const mesa = document.createElement("div");
			mesa.classList.add("mesa");

			mesa.appendChild(document.createTextNode(i));
			mesa.dataset.numeroMesa = i;
			let table = new Table(i);

			tables.push(table);

			mesa.addEventListener("click", (e) => {
				selecionarMesa(mesa);
				showCurrentProductsOfTable(tables[mesa.textContent - 1]);
			});

			tablesContainer.appendChild(mesa);
		}
	}

	function selecionarMesa(mesa) {
		const mesas = document.querySelectorAll(".mesa");

		mesas.forEach((m) => m.classList.remove("selecionada", "aberta"));

		formPedido.style.display = "none";
		productForm.style.display = "none";

		if (mesa.classList.contains("fechada")) {
			mesa.classList.add("aberta");
		} else {
			mesa.classList.add("selecionada");
			formPedido.style.display = "block";
			//productForm.style.display = "block";
			updateTotal(tables[mesa.textContent - 1]);
			//showCurrentProductsOfTable(tables[mesa.textContent - 1]);
		}
	}

	btnCriar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		productForm.style.display = "block";
		criarPedido(currentTable);
	});

	function criarPedido(mesa) {
		tables[mesa.textContent - 1].addProduct(
			new Product("Produto teste", ProductType.P, 555.0)
		);
		updateTotal(tables[mesa.textContent - 1]);
		showCurrentProductsOfTable(tables[mesa.textContent - 1]);
	}

	btnEditar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		editarPedido(currentTable);
	});

	function editarPedido() {
		console.log("Editar Pedido");
	}

	btnApagar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		apagarPedido(currentTable);
	});

	function apagarPedido() {
		console.log("Apagar Pedido");
	}

	btnFechar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		fecharPedidos(currentTable);
	});

	function fecharPedidos() {
		formPedido.style.display = "none";
		productForm.style.display = "none";
	}

	//! ---------------------------------------------------------------------------

	function createElement(tag, id = "") {
		let elem = document.createElement(tag);
		id ? (elem.id = id) : (elem.id = "");
		return elem;
	}

	function createText(elem, text) {
		let texto = document.createTextNode(text);
		elem.appendChild(texto);
	}

	function appendElements(elem, childs) {
		elem.replaceChildren();
		let arr = Array.from(childs);
		arr.forEach((c) => elem.appendChild(c));
	}

	function checkProductAmount(products) {
		let total = {};

		products.forEach((p) => {
			if (!total.hasOwnProperty(p)) {
				total[p] = {
					product: p.description,
					amount: 1,
				};
			} else {
				total[p].amount++;
			}
		});
		return total;
	}

	function makeRow(product, quantity) {
		let tr = createElement("tr");

		let thProduto = createElement("th");
		let thQuantidade = createElement("th");
		let thPreco = createElement("th");
		createText(thProduto, product.description);
		createText(thQuantidade, quantity);
		createText(thPreco, `${product.price} €`);
		appendElements(tr, [thProduto, thQuantidade, thPreco]);

		return tr;
	}

	function showCurrentProductsOfTable(mesa) {
		let table = document.getElementById("form-product-table");
		let thead = createElement("thead", "form-product-table-header");
		let tbody = createElement("tbody", "form-product-table-body");

		let thProduto = createElement("th");
		createText(thProduto, "Produto");
		let thQuantidade = createElement("th");
		createText(thQuantidade, "Quantidade");
		let thPreco = createElement("th");
		createText(thPreco, "Preço");

		appendElements(thead, [thProduto, thQuantidade, thPreco]);

		let rows = [];

		let { amount } = checkProductAmount(mesa.products);
		mesa.products.forEach((p) => {
			rows.push(makeRow(p, amount || 1));
		});
		appendElements(tbody, rows);
		appendElements(table, [thead, tbody]);
	}

	//! ---------------------------------------------------------------------------

	function exibirProdutosLayout() {
		formPedido.style.display = "none";
		productForm.style.display = "none";

		tablesContainer.style.display = "none";
		productsContainer.style.display = "block";

		exibirProdutos();
	}

	function exibirProdutos() {
		const menu = new Menu();
		menu.addProducts(
			new Product("Produto 1", ProductType.E, 10.0),
			new Product("Produto 2", ProductType.B, 15.0)
		);

		const table = document.getElementById("products-table");
		const tbody = table.querySelector("tbody");

		table.querySelector("thead").appendChild(Product.thead);

		tbody.replaceChildren();
		menu.products.forEach((product) => {
			const tr = document.createElement("tr");
			for (let property in product) {
				if (product.hasOwnProperty(property) && property !== "toTrTd") {
					const td = document.createElement("td");
					td.textContent = product[property];
					tr.appendChild(td);
				}
			}
			tbody.appendChild(tr);
		});
	}

	//? ------------------TIPOS DE PRODUTO--------------------------------
	let ProductType = {
		E: "Entrada",
		B: "Bebida",
		P: "Prato Principal",
		S: "Sobremesa",
	};
	//! ------------------TIPOS DE PRODUTO--------------------------------
	//? ------------------CLASSE PRODUTO--------------------------------
	class Product {
		constructor(description = "", productType = "", price = 0.0) {
			this.description = description;
			this.productType = productType;
			this.price = parseFloat(price);
		}

		toTrTd() {
			let tr = createElement("tr");
			let td = createElement("td");
			for (let property in this) {
				if (this.hasOwnProperty(property) && property !== "toTrTd") {
					createText(td, this[property]);
				}
			}
			appendElements(tr, [td]);

			return tr;
		}
	}

	Product.propertyLabels = {
		description: "Descrição",
		productType: "Tipo",
		price: "Preço",
	};

	Product.thead = (function () {
		let defaultProduct = new Product();
		let tr = document.createElement("tr");
		for (let property in defaultProduct) {
			if (defaultProduct.hasOwnProperty(property) && property !== "toTrTd") {
				let th = document.createElement("th");
				th.appendChild(
					document.createTextNode(Product.propertyLabels[property])
				);
				tr.appendChild(th);
			}
		}
		return tr;
	})();
	//! ------------------CLASSE PRODUTO--------------------------------

	//? ------------------CLASSE MENU--------------------------------
	class Menu {
		constructor() {
			this.products = [];
		}

		static show(menu = Menu.default) {
			menu.show();
		}

		static add(menu = Menu.default) {
			let data = prompt(
				"Indique os dados do produto a adicionar:",
				"<descrição>|<tipo: E-Entrada/B-Bebida/P-Prato Principal/S-Sobremesa>|<preço>"
			);
			if (data) {
				let values = data.split("|");
				if (values.length !== 3) {
					alert(
						"Dados mal introduzidos. Devia ser '<descrição>|<tipo: E-Entrada/B-Bebida/P-Prato Principal/S-Sobremesa>|<preço>'!"
					);
				} else {
					let description = values[0].trim();
					let productType = values[1].toUpperCase().trim();
					let price = parseFloat(values[2].trim());
					if (!(productType in ProductType)) {
						alert("Tipo de produto inválido. Utilize E, B, P ou S.");
						return;
					}
					if (isNaN(price) || price <= 0) {
						alert(" inválido. Insira um valor numérico positivo.");
						return;
					}
					let newProduct = new Product(description, productType, price);
					menu.add(newProduct);
					menu.show();
				}
			}
		}

		static remove(menu = Menu.default) {
			const description = prompt(
				"Indique parte da descrição do produto a remover:"
			);

			if (description) {
				const initialLength = menu.products.length;
				menu.remove(description);

				if (menu.products.length !== initialLength) {
					menu.show();
				} else {
					alert(
						`Nenhum produto encontrado com essa descrição'${description}'.`
					);
				}
			}
		}

		static search(menu = Menu.default) {
			let description = prompt(
				"Indique parte da descrição do produto a procurar:"
			);
			if (description) {
				menu.search(description);
				menu.show(); // Make sure to show the updated menu after search
			}
		}

		static sort(property, menu = Menu.default) {
			const compare = (a, b) => {
				if (a[property] < b[property]) {
					return -1;
				}
				if (a[property] > b[property]) {
					return 1;
				}
				return 0;
			};

			menu.sort(compare);
			menu.show();
		}

		toTable() {
			let table = createElement("table");
			let thead = createElement("thead");
			let tbody = createElement("tbody");
			if (this.products.length === 0) {
				return "";
			} else {
				//let resultado = `<table><thead>${Product.thead}</thead>`;
				appendElements(thead, [Product.thead]);
				this.products.forEach((product) => {
					appendElements(tbody, [product.toTrTd()]);
					//resultado += product.toTrTd();
				});
				//resultado += "</table>";
				//return resultado;
				appendElements(table, [thead, tbody]);
			}
			return table;
		}

		addProducts(...products) {
			products.forEach(function (product) {
				this.add(product);
			}, this); //Indicar que a ementa atual será o this dentro de cada chamada à função anterior
			return this;
		}
	}

	Menu.prototype.show = function () {
		document.getElementById("products").appendChild(this.toTable());
	};

	Menu.prototype.add = function (product) {
		const existingProductIndex = this.products.findIndex(
			(p) =>
				p.description === product.description &&
				p.productType === product.productType
		);
		if (existingProductIndex !== -1) {
			this.products[existingProductIndex].price = product.price;
		} else {
			this.products.push(product);
		}
		return this;
	};

	Menu.prototype.remove = function (description) {
		const initialLength = this.products.length;
		this.products = this.products.filter(
			(product) =>
				!product.description.toLowerCase().includes(description.toLowerCase())
		);

		if (this.products.length !== initialLength) {
			// If products were removed, update the display
			this.show();
		} else {
			alert(`Nenhum produto encontrado com essa descrição '${description}'.`);
		}

		return this;
	};

	Menu.prototype.sort = function (compare) {
		this.products.sort(compare);
		return this;
	};

	Menu.default = new Menu().addProducts(
		new Product("Arroz de Marisco", "P", 15.0),
		new Product("Choco Frito", "P", 10.0),
		new Product("Arroz Doce", "S", 2.5),
		new Product("Pão", "E", 0.8),
		new Product("Água", "B", 1.2)
	);
	//! ------------------CLASSE MENU--------------------------------
});
