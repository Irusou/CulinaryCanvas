"use strict";

class Table {
	constructor(tableNumber) {
		this.tableNumber = tableNumber;
		this.products = [];
	}

	addProduct(product) {
		let existingProductIndex = this.products.findIndex(
			(p) => p.descricao === product.descricao
		);

		if (existingProductIndex === -1) {
			this.products.push(product);
		} else {
			this.products[existingProductIndex].quantidade += parseInt(
				product.quantidade
			);
		}
	}

	removeProduct(product) {
		let existingProductIndex = this.products.findIndex(
			(p) => p.descricao === product
		);

		if (existingProductIndex === -1) {
			return;
		} else {
			if (this.products[existingProductIndex].quantidade > 0) {
				this.products[existingProductIndex].quantidade--;
			} else {
				this.products[existingProductIndex].slice(existingProductIndex, 1);
			}
		}
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
	let btCriar = document.getElementById("btCriar");
	let menu;
	let selectedRow;

	let productSelect = document.querySelector("#select-product");

	const totalMesas = 10;
	let tables = [];

	mesasLink.addEventListener("click", function (e) {
		exibirMesasLayout();
	});

	produtosLink.addEventListener("click", function (e) {
		if (!menu instanceof Menu || !menu) {
			menu = new Menu();
		}
		exibirProdutosLayout(menu);
	});

	/**
	 * calcula o preço total de produtos de uma mesa
	 * @param {*} productList
	 * @returns preço total de produtos de uma mesa
	 */
	function calculateTotal(productList) {
		return productList.reduce((init, curr) => {
			return (init += curr.quantidade * curr.preco);
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
			p.appendChild(document.createTextNode(`Total ${total.toFixed(2)} €`));
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

		if (!mesa.classList.contains("fechada")) {
			mesa.classList.add("selecionada");
			formPedido.style.display = "block";
			updateTotal(tables[mesa.textContent - 1]);
		}
	}

	btnCriar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		productForm.style.display = "block";

		let btAdd = document.getElementById("btnAdd");
		let btCancel = document.getElementById("btnCancel");

		btAdd.addEventListener("click", (e) => {
			let opt = productSelect.options[productSelect.selectedIndex];
			let quantity = document.getElementById("ipt-quantidade").value;

			if (opt && quantity) {
				let description = opt.dataset.description;
				let price = opt.dataset.price;
				let obj = {
					descricao: description,
					preco: parseFloat(price),
					quantidade: parseInt(quantity),
				};

				criarPedido(currentTable, obj);
			}
		});

		btCancel.addEventListener("click", (e) => {
			productForm.style.display = "none";
		});
	});

	function criarPedido(mesa, produto) {
		tables[mesa.textContent - 1].addProduct(produto);
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
		apagarPedido(currentTable, selectedRow);
	});

	function apagarPedido(mesa, row) {
		let produto = row.children[0].textContent;
		tables[mesa.textContent - 1].removeProduct(produto);

		updateTotal(tables[mesa.textContent - 1]);
		showCurrentProductsOfTable(tables[mesa.textContent - 1]);
	}

	btnFechar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		fecharPedidos(currentTable);
	});

	function fecharPedidos(mesa) {
		mesa.classList.add("fechada");
		mesa.addEventListener("dblclick", (e) => {
			mesa.classList.remove("fechada");

			updateTotal(tables[mesa.textContent - 1]);
			showCurrentProductsOfTable(tables[mesa.textContent - 1]);
		});
		formPedido.style.display = "none";
		productForm.style.display = "none";
	}

	function createElement(tag, id = "") {
		let elem = document.createElement(tag);
		if (id) {
			elem.id = id;
		}

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

	function makeRow(product) {
		let tr = createElement("tr", "product-row");
		let thProduto = createElement("th");
		let thQuantidade = createElement("th");
		let thPreco = createElement("th");

		createText(thProduto, product.descricao);
		createText(thQuantidade, product.quantidade);
		createText(thPreco, product.preco);
		appendElements(tr, [thProduto, thQuantidade, thPreco]);

		tr.addEventListener("dblclick", (e) => {
			selectedRow = tr;
			let rows = document.querySelectorAll("#product-row");
			rows.forEach((r) => {
				r.classList.remove("selected");
			});
			selectedRow.classList.add("selected");
		});

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
		mesa.products.forEach((p) => {
			if (p.quantidade > 0) {
				rows.push(makeRow(p, p.quantidade || 1));
			}
		});
		appendElements(tbody, rows);
		appendElements(table, [thead, tbody]);
	}

	//! ---------------------------------------------------------------------------

	function exibirProdutosLayout(menu) {
		let form = document.getElementById("add-product-form");
		form.addEventListener("submit", (e) => e.preventDefault());
		formPedido.style.display = "none";
		productForm.style.display = "none";

		tablesContainer.style.display = "none";
		productsContainer.style.display = "flex";

		exibirProdutos(menu);

		btCriar.addEventListener("click", (e) => {
			let desc = document.getElementById("ipt-desc").value;
			let type = document.getElementById("ipt-type").value;
			let price = document.getElementById("ipt-price").value;
			if (!desc || !type || !price) {
				return;
			}
			let product = new Product(desc, type, price);
			let exist = false;
			menu.products.forEach((p) => {
				if (
					p.description === product.description &&
					p.type === product.type &&
					p.price === product.price
				)
					exist = true;
			});

			if (!exist) {
				menu.products.push(product);
			}

			exibirProdutos(menu);
		});
	}

	function exibirProdutos(menu) {
		let tbody = document.getElementById("form-product-table-body");
		tbody.replaceChildren();
		let trs = [];
		menu.products.forEach((p) => {
			let tr = createElement("tr", "product-row");
			let desc = createElement("th");
			createText(desc, p.description);
			let type = createElement("th");
			createText(type, p.productType);
			let price = createElement("th");
			createText(price, p.price);
			appendElements(tr, [desc, type, price]);
			trs.push(tr);
		});

		appendElements(tbody, trs);
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
				appendElements(thead, [Product.thead]);
				this.products.forEach((product) => {
					appendElements(tbody, [product.toTrTd()]);
				});
				appendElements(table, [thead, tbody]);
			}
			return table;
		}

		addProducts(...products) {
			let opt = createElement("option");
			opt.value = "";
			let options = [];
			options.push(opt);
			createText(opt, "Escolha um produto");
			products.forEach(function (product) {
				this.products.push(product);
				opt = createElement("option", product.description);
				opt.dataset.description = product.description;
				opt.dataset.type = product.productType;
				opt.dataset.price = product.price;
				opt.value = product.description;
				createText(opt, product.description);
				options.push(opt);
			}, this); //Indicar que a ementa atual será o this dentro de cada chamada à função anterior

			appendElements(productSelect, options);

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
