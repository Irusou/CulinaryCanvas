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
			this.tables = await this.fetchTables();
			this.tables.forEach((table) => {
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
			this.products = await this.fetchProducts();
			const table = createProductsTable(this.products);
			createProductsSelect(this.products);
			productsContainer.appendChild(table);
		}

		async loadTypes() {
			typesContainer.replaceChildren();
			this.types = await this.fetchTypes();
			var table = createTypesTable(this.types);

			const createButton = document.createElement("button");
			createButton.classList.add("type-addBtn");
			createButton.textContent = "Criar";

			const editButton = document.createElement("button");
			editButton.classList.add("type-editBtn");
			editButton.textContent = "Editar";

			const deleteButton = document.createElement("button");
			deleteButton.classList.add("type-deleteBtn");
			deleteButton.textContent = "Apagar";
			typesContainer.appendChild(table);

			const input = document.createElement("input");
			input.style.display = "none";
			input.type = "text";
			typesContainer.appendChild(input);

			const dashboard = document.createElement("div");

			dashboard.classList.add("dashboard");

			dashboard.appendChild(createButton);
			dashboard.appendChild(editButton);
			dashboard.appendChild(deleteButton);

			typesContainer.appendChild(dashboard);

			createButton.addEventListener("click", async (e) => {
				input.style.display = "block";
				if (input.value) {
					await fetch("http://localhost:4040/product-types", {
						method: "POST",
						headers: { "Content-type": "application/json" },
						body: JSON.stringify({ description: input.value }),
					});
					await this.loadTypes();
				}
			});

			editButton.addEventListener("click", async (e) => {
				input.style.display = "block";
				const tr = document.querySelector(".selected-row");
				if (input.value) {
					await fetch(`http://localhost:4040/product-types/${tr.id}`, {
						method: "PUT",
						headers: { "Content-type": "application/json" },
						body: JSON.stringify({ description: input.value }),
					});
					await this.loadTypes();
				}
			});

			deleteButton.addEventListener("click", async (e) => {
				const row = document.querySelector(".selected-row");
				if (row) {
					await fetch(`http://localhost:4040/product-types/${row.id}`, {
						method: "DELETE",
					});
				}
				await this.loadTypes();
			});
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

	btnAdd.addEventListener("click", async (e) => {
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
		await createOrderTable();
		document.getElementById("select-form").value = 0;
		document.getElementById("select-form").textContent = "";
		document.getElementById("ipt-quantidade").value = "";
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
		orderFormContainer.style.display = "none";
		productFormContainer.style.display = "none";
		typesContainer.style.display = "none";
		tablesContainer.style.display = "none";
		util.loadProducts();
	});

	showTypesLayout.addEventListener("click", (e) => {
		productsContainer.style.display = "none";
		orderFormContainer.style.display = "none";
		productFormContainer.style.display = "none";
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

		const thDescription = document.createElement("th");
		thDescription.textContent = "Descrição";

		header.appendChild(thDescription);

		table.appendChild(header);

		types.forEach((t) => {
			const tr = document.createElement("tr");
			tr.id = t.id;

			tr.addEventListener("click", () => {
				if (!tr.classList.contains("selected-row")) {
					tr.classList.add("selected-row");
				} else {
					tr.classList.remove("selected-row");
				}
			});

			const tdDescription = document.createElement("td");
			tdDescription.textContent = t.description;

			tr.appendChild(tdDescription);

			table.appendChild(tr);
		});

		return table;
	};
}

window.onload = init;
