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

				tableElement.addEventListener("click", (evt) => {
					if (orderFormContainer.style.display === "none") {
						orderFormContainer.style.display === "block";
					} else {
						orderFormContainer.style.display === "none";
					}
				});

				tablesContainer.appendChild(tableElement);
			});
		}

		async loadProducts() {
			productsContainer.replaceChildren();
			const products = await this.fetchProducts();
			const table = createProductsTable(products);
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
	const showTablesLayout = document.querySelector("#table-link");
	const showProductsLayout = document.querySelector("#product-link");
	const showTypesLayout = document.querySelector("#type-link");

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
