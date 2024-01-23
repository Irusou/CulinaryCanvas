"use strict";
function init() {
	class Table {
		constructor(id, isOpen) {
			this.id = id;
			this.isOpen = isOpen;
		}

		async closeTable() {
			await fetch(`http://localhost:4040/tables/${this.id}`, { method: "PUT" });
		}
	}

	class Product {
		constructor(id, description, price, type) {
			this.id = id;
			this.description = description;
			this.price = price;
			this.type = type;
		}
	}

	class Type {
		constructor(id, description) {
			this.id = id;
			this.description = description;
		}
	}

	class Util {
		constructor() {
			this.tables = [];
			this.products = [];
			this.types = [];
		}

		async fetchTables() {
			const res = await fetch("http://localhost:4040/tables");
			const tables = await res.json();

			return tables;
		}

		async fetchProducts() {
			const res = await fetch("http://localhost:4040/products");
			const products = await res.json();

			return products;
		}

		async fetchTypes() {
			const res = await fetch("http://localhost:4040/product-types");
			const types = await res.json();

			return types;
		}

		async loadTables() {
			tablesContainer.replaceChildren();
			const tables = await this.fetchTables();

			tables.forEach((table) => {
				const tableElement = document.createElement("div");
				tableElement.classList.add("mesa");
				tableElement.textContent = table.id;
				if (table.isOpen) {
					tableElement.classList.add("aberta");
				} else {
					tableElement.classList.add("fechada");
				}

				tablesContainer.appendChild(tableElement);
			});

			const mesas = document.querySelectorAll(".mesa");
			orderFormContainer.style.display = "none";
			mesas.forEach((mesa) => {
				mesa.classList.remove("selected");
				mesa.addEventListener("click", (evt) => {
					if (!mesa.classList.contains("selected")) {
						mesa.classList.add("selected");
						orderFormContainer.style.display = "block";
						const tableNumber = document.getElementById("table-form-header");
						tableNumber.textContent = `Mesa ${evt.target.textContent}`;
						formProductTable.replaceChildren();
						createOrderTable();
						mesa.classList.remove("selected");
					}
				});
			});
		}

		async loadProducts() {
			productsContainer.replaceChildren();
			const products = await this.fetchProducts();
			const table = createProductsTable(products);
			createProductsSelect(products);
			productsContainer.appendChild(table);
		}

		async loadTypes() {
			typesContainer.replaceChildren();
			const types = await this.fetchTypes();
			const table = createTypesTable(types);
			typesContainer.appendChild(table);
		}
	}
	const util = new Util();

	const tablesContainer = document.querySelector(".tables-container");
	const productsContainer = document.querySelector(".products-container");
	const typesContainer = document.querySelector(".types-container");
	const orderFormContainer = document.querySelector(".order-form-container");
	const productFormContainer = document.querySelector(
		".product-form-container"
	);
	const formProductTable = document.getElementById("form-product-table");

	const showTablesLayout = document.querySelector("#table-link");
	const showProductsLayout = document.querySelector("#product-link");
	const showTypesLayout = document.querySelector("#type-link");

	// butões para controlar produtos de uma mesa
	const btnCriar = document.querySelector("#btnCriar");
	const btnEditar = document.querySelector("#btnEditar");
	const btnApagar = document.querySelector("#btnApagar");
	const btnFechar = document.querySelector("#btnFechar");

	const btnAdd = document.querySelector("#btnAdd");
	const btnCancel = document.querySelector("#btnCancel");

	btnCriar.addEventListener("click", (e) => {
		util.loadProducts();
		productFormContainer.style.display = "block";
	});

	btnFechar.addEventListener("click", (e) => {
		closeTable();
	});

	btnAdd.addEventListener("click", (e) => {
		e.preventDefault();
		const product = document.getElementById("select-form").value;
		const table = document.getElementById("table-form-header");
		const quantity = document.getElementById("ipt-quantidade").value;
		const number = table.textContent.split(" ")[1];
		const order = {
			product,
			quantity,
		};
		addToOrder(number, order);
		formProductTable.replaceChildren();
		createOrderTable();
	});

	btnCancel.addEventListener("click", (e) => {
		document.getElementById("select-form").value = 0;
		document.getElementById("select-form").textContent = "";
		document.getElementById("ipt-quantidade").value = "";
		productFormContainer.style.display = "none";
	});

	async function addToOrder(table, order) {
		const { product, quantity } = order;
		await fetch(`http://localhost:4040/order-items/${table}`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify({ product, quantity }),
		});
	}

	async function closeTable() {
		const table = document.getElementById("table-form-header");
		const number = table.textContent.split(" ")[1];
		await fetch(`http://localhost:4040/tables/${number}`, {
			method: "PUT",
		});
		util.loadTables();
	}

	showTablesLayout.addEventListener("click", () => {
		productsContainer.style.display = "none";
		typesContainer.style.display = "none";
		tablesContainer.style.display = "flex";
		util.loadTables();
	});

	showProductsLayout.addEventListener("click", () => {
		productsContainer.style.display = "flex";
		typesContainer.style.display = "none";
		tablesContainer.style.display = "none";
		util.loadProducts();
	});

	showTypesLayout.addEventListener("click", () => {
		productsContainer.style.display = "none";
		typesContainer.style.display = "flex";
		tablesContainer.style.display = "none";
		util.loadTypes();
	});

	const createProductsTable = (products) => {
		const table = document.createElement("table");
		table.classList.add("product-table");

		const header = document.createElement("tr");
		header.classList.add("product-table-header");

		const thDescription = document.createElement("td");
		thDescription.textContent = "Descrição";

		const thType = document.createElement("td");
		thType.textContent = "Tipo";

		const thPrice = document.createElement("td");
		thPrice.textContent = "Preço";

		header.appendChild(thDescription);
		header.appendChild(thType);
		header.appendChild(thPrice);

		table.appendChild(header);

		products.forEach((p) => {
			const tr = document.createElement("tr");
			tr.id = p.id;

			const tdDescription = document.createElement("td");
			tdDescription.textContent = p.Produto;

			const tdType = document.createElement("td");
			tdType.textContent = p.Tipo.slice(0, 1);

			const tdPrice = document.createElement("td");
			tdPrice.textContent = p.Preço;

			tr.appendChild(tdDescription);
			tr.appendChild(tdType);
			tr.appendChild(tdPrice);

			table.appendChild(tr);
		});

		return table;
	};

	const createOrderTable = async () => {
		const number = document
			.getElementById("table-form-header")
			.textContent.split(" ")[1];
		const res = await fetch(`http://localhost:4040/order-items/${number}`);
		const orders = await res.json();
		const o = {};

		orders.forEach((order) => {
			const { Produto, Quantidade, Preco } = order;
			o[Produto] = {
				Quantidade: (o[Produto]?.Quantidade || 0) + Quantidade,
				Preco,
			};
		});

		const result = Object.keys(o).map((Produto) => ({
			Produto,
			...o[Produto],
		}));

		//? populate the table
		const header = document.createElement("tr");
		const thProduct = document.createElement("th");
		thProduct.textContent = "Produto";
		const thQuantity = document.createElement("th");
		thQuantity.textContent = "Quantidade";
		const thPrice = document.createElement("th");
		thPrice.textContent = "Preço";

		header.appendChild(thProduct);
		header.appendChild(thQuantity);
		header.appendChild(thPrice);

		header.classList.add("form-product-table-header");

		formProductTable.appendChild(header);

		result.forEach((row) => {
			const tr = document.createElement("tr");
			const product = document.createElement("th");
			product.textContent = row.Produto;
			const quantity = document.createElement("th");
			quantity.textContent = row.Quantidade;
			const price = document.createElement("th");
			price.textContent = row.Preco.toFixed(1);

			tr.appendChild(product);
			tr.appendChild(quantity);
			tr.appendChild(price);
			formProductTable.appendChild(tr);
		});

		//? populate the label
		const total = calculateTotal(result);
		document.getElementById("label-total").textContent = `${total.toFixed(2)}€`;
	};

	const calculateTotal = (products) => {
		let total = 0;
		products.forEach(
			(product) => (total += product.Quantidade * product.Preco)
		);
		return total;
	};

	const createProductsSelect = (products) => {
		const select = document.getElementById("select-form");
		select.replaceChildren();
		const headerOption = document.createElement("option");
		headerOption.textContent = "";
		headerOption.value = 0;
		select.appendChild(headerOption);

		products.forEach((product) => {
			const option = document.createElement("option");
			option.value = product.ID;
			option.textContent = product.Produto;
			select.appendChild(option);
		});
		return select;
	};

	const createTypesTable = (types) => {
		const table = document.createElement("table");
		table.classList.add("type-table");

		const header = document.createElement("tr");
		header.classList.add("type-table-header");

		const thDescription = document.createElement("td");
		thDescription.textContent = "Tipo";

		header.appendChild(thDescription);

		table.appendChild(header);

		types.forEach((t) => {
			const tr = document.createElement("tr");
			tr.id = t.id;

			const tdDescription = document.createElement("td");
			tdDescription.textContent = t.description;

			tr.appendChild(tdDescription);

			table.appendChild(tr);
		});

		return table;
	};
}

window.onload = init;
