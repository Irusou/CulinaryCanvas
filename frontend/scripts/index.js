"use strict";

function irParaHomePage() {
	window.location.href = "/frontend/index.html";
}

document.addEventListener("DOMContentLoaded", function () {
	const mesasContainer = document.getElementById("mesas-container");
	const mesasLink = document.getElementById("mesas-link");
	const produtosContainer = document.getElementById("produtos-container");
	const produtosLink = document.getElementById("produtos-link");
	let formPedido = document.getElementById("order-form-container");
	let btnCriar = document.getElementById("btnCriar");
	let btnEditar = document.getElementById("btnEditar");
	let btnApagar = document.getElementById("btnApagar");
	let btnFechar = document.getElementById("btnFechar");

	const totalMesas = 10;

	mesasLink.addEventListener("click", function (e) {
		exibirMesasLayout();
	});

	produtosLink.addEventListener("click", function (e) {
		exibirProdutosLayout();
	});

	//! -----------------------------------------------------------------------------------

	function exibirMesasLayout() {
		mesasContainer.style.display = "block";
		produtosContainer.style.display = "none";

		mesasContainer.replaceChildren(); // Limpar o conteúdo anterior

		for (let i = 1; i <= totalMesas; i++) {
			const mesa = document.createElement("div");
			mesa.classList.add("mesa");
			mesa.appendChild(document.createTextNode(i));
			mesa.dataset.numeroMesa = i;

			mesa.addEventListener("click", (e) => {
				console.log(e.target);
				selecionarMesa(mesa);
			});

			mesasContainer.appendChild(mesa);
		}
	}

	function selecionarMesa(mesa) {
		const mesas = document.querySelectorAll(".mesa");

		mesas.forEach((m) => m.classList.remove("selecionada", "aberta"));

		formPedido.style.display = "none";

		if (mesa.classList.contains("fechada")) {
			mesa.classList.add("aberta");
		} else {
			mesa.classList.add("selecionada");
			formPedido.style.display = "block";
		}
	}

	btnCriar.addEventListener("click", (e) => {
		let currentTable = document.getElementsByClassName("mesa selecionada")[0];
		criarPedido(currentTable);
	});

	function criarPedido(mesa) {
		console.log(`Criar Pedido ${mesa.textContent}`);
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
	}

	//! ---------------------------------------------------------------------------

	function exibirProdutosLayout() {
		formPedido.style.display = "none";
		console.log("Exibindo Produtos Layout");
		console.log("Mesas Container:", mesasContainer.style.display);
		console.log("Produtos Container:", produtosContainer.style.display);

		mesasContainer.style.display = "none";
		produtosContainer.style.display = "block";

		// Call the function to display products
		exibirProdutos();
	}

	function exibirProdutos() {
		// Your existing logic to display products
		console.log("A exibir Produtos");
		const menu = new Menu();
		menu.addProducts(
			new Product("Produto 1", ProductType.E, 10.0),
			new Product("Produto 2", ProductType.B, 15.0)
			// Add more products as needed
		);

		const table = document.getElementById("products-table");
		const tbody = table.querySelector("tbody");

		// Add the table header
		table.querySelector("thead").appendChild(Product.thead);

		// Clear existing rows in the table body
		tbody.appendChild(document.createTextNode(""));

		// Add rows for each product in the menu
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

	/**
	 * @enum {string} ProductType - Tipos de Produtos.
	 * @readonly
	 */
	let ProductType = {
		E: "Entrada",
		B: "Bebida",
		P: "Prato Principal",
		S: "Sobremesa",
	};

	/**
	 * Classe Product
	 */

	/**
	 * @class Representa um produto da ementa
	 * @constructs Product
	 * @param {string} description - descrição do produto.
	 * @param {string} productType - tipo do produto, baseado nos valores de ProductType.
	 * @param {number} price - preço do produto.
	 *
	 * @property {string} description - descrição do produto
	 * @property {string} productType - tipo do produto, baseado nos valores de ProductType.
	 * @property {number} price - preço do produto.
	 */
	function Product(description = "", productType = "", price = 0.0) {
		this.description = description;
		this.productType = productType;
		this.price = parseFloat(price); // Ensure the price is a float number
	}

	/** Métodos de Instância */

	/**
	 * Representação da informação de um produto sob a forma do código HTML para construir uma linha de tabela
	 * @returns {string} representação da informação de um produto sob a forma do código HTML para construir uma linha de tabela.
	 */
	Product.prototype.toTrTd = function () {
		let html = "<tr>";

		for (let property in this) {
			if (this.hasOwnProperty(property) && property !== "toTrTd") {
				html += `<td>${this[property]}</td>`;
			}
		}

		html += "</tr>";
		return html;
	};

	/** Propriedades e Métodos de Classe */

	/**
	 * @memberof Product
	 * @property {object} propertyLabels - Equivalência entre o nome das propriedades e o descritivo em português
	 * @readonly
	 */
	Product.propertyLabels = {
		description: "Descrição",
		productType: "Tipo",
		price: "Preço",
	};

	/**
	 * @memberof Product
	 * @property {string} thead - String com código HTML para construir uma linha de cabeçalho de tabela com a informação dos produtos (será acedida como "propriedade de classe").
	 * @readonly
	 */
	Product.thead = (function () {
		let defaultProduct = new Product();
		let html = "<tr>";

		for (let property in defaultProduct) {
			if (defaultProduct.hasOwnProperty(property) && property !== "toTrTd") {
				html += `<th>${Product.propertyLabels[property]}</th>`;
			}
		}

		html += "</tr>";
		return html;
	})();
	//! fim class product
	/**
	 * Classe Menu
	 */

	/**
	 * @class Representa a ementa do restaurante
	 * @constructs Menu
	 *
	 * @property {Product[]} products - produtos da ementa
	 */
	function Menu() {
		this.products = [];
	}

	/** Métodos de Instância */

	/**
	 * Cria uma string com código HTML para construir uma tabela com a informação de todos os produtos
	 * @returns {string} código HTML para construir uma tabela com a informação de todos os produtos da ementa.
	 */
	Menu.prototype.toTable = function () {
		if (this.products.length === 0) {
			return "";
		} else {
			let resultado = `<table><thead>${Product.thead}</thead>`;
			this.products.forEach(function (product) {
				resultado += product.toTrTd();
			});
			resultado += "</table>";
			return resultado;
		}
	};

	/**
	 * Coloca a informação da ementa, em formato de tabela, no div com id="products"
	 */
	Menu.prototype.show = function () {
		document.getElementById("products").innerHTML = this.toTable();
	};

	/**
	 * Acrescenta um produto à ementa. Se ele já existir (mesma descrição e tipo) então apenas atualiza o seu preço
	 * @param {Product} product - produto para acrescentar à ementa.
	 * @returns {Menu} o próprio objeto Menu: permite a realização de "Method Chaining".
	 */
	Menu.prototype.add = function (product) {
		const existingProductIndex = this.products.findIndex(
			(p) =>
				p.description === product.description &&
				p.productType === product.productType
		);
		if (existingProductIndex !== -1) {
			// If the product already exists, update its price
			this.products[existingProductIndex].price = product.price;
		} else {
			// Otherwise, add the new product to the menu
			this.products.push(product);
		}
		return this;
	};

	/**
	 * Acrescenta diversos produtos à ementa
	 * @param {...Product} products - produtos para acrescentar à ementa.
	 * @returns {Menu} o próprio objeto Menu: permite a realização de "Method Chaining".
	 */
	Menu.prototype.addProducts = function (...products) {
		products.forEach(function (product) {
			this.add(product);
		}, this); //Indicar que a ementa atual será o this dentro de cada chamada à função anterior
		return this;
	};

	/**
	 * Remove produtos à ementa
	 * @param {string} description - parte de uma descrição de produto que servirá como padrão para selecionar os produtos a remover.
	 * @returns {Menu} o próprio objeto Menu: permite a realização de "Method Chaining".
	 */
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

	/**
	 * Apresenta, via alert, a informação (descrição e preço) dos produtos da ementa
	 * @param {string} description - parte de uma descrição de produto que servirá como padrão para selecionar os produtos a apresentar.
	 * @returns {Menu} o próprio objeto Menu: permite a realização de "Method Chaining".
	 */
	/**
	 * Ordena os produtos da ementa utilizando a função de comparação indicada
	 * @param {function} compare - função de comparação entre produtos que servirá de base para a ordenação.
	 * @returns {Menu} o próprio objeto Menu: permite a realização de "Method Chaining".
	 */
	Menu.prototype.sort = function (compare) {
		this.products.sort(compare);
		return this;
	};

	/** Métodos de Classe */

	/**
	 * Coloca a informação da ementa, em formato de tabela, na página
	 * @memberof Menu
	 * @param {Menu} [menu=Menu.default] - ementa para apresentar na página.
	 */
	Menu.show = function (menu = Menu.default) {
		menu.show();
	};

	/**
	 * Acrescenta um produto à ementa. A informação do produto será pedida ao utilizador através de "prompt"
	 * @memberof Menu
	 * @param {Menu} [menu=Menu.default] - ementa para apresentar a informação.
	 */
	Menu.add = function (menu = Menu.default) {
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
				// Validate and process user input
				let description = values[0].trim();
				let productType = values[1].toUpperCase().trim();
				let price = parseFloat(values[2].trim());

				// Validate the product type
				if (!(productType in ProductType)) {
					alert("Tipo de produto inválido. Utilize E, B, P ou S.");
					return;
				}

				// Validate the price
				if (isNaN(price) || price <= 0) {
					alert("Preço inválido. Insira um valor numérico positivo.");
					return;
				}

				// Create a new product with validated data
				let newProduct = new Product(description, productType, price);

				// Add the product to the menu
				menu.add(newProduct);

				// Display the updated menu
				menu.show();
			}
		}
	};

	/**
	 * Remove produtos à ementa. A informação das descrição dos produtos a remover será pedida ao utilizador através de "prompt"
	 * @memberof Menu
	 * @param {Menu} [menu=Menu.default] - ementa para apresentar a informação.
	 */
	Menu.remove = function (menu = Menu.default) {
		const description = prompt(
			"Indique parte da descrição do produto a remover:"
		);

		if (description) {
			const initialLength = menu.products.length;
			menu.remove(description);

			if (menu.products.length !== initialLength) {
				// If products were removed, update the display
				menu.show();
			} else {
				alert(`Nenhum produto encontrado com essa descrição'${description}'.`);
			}
		}
	};
	/**
	 * Apresenta, via alert, a informação (descrição e preço) dos produtos da ementa. A informação das descrições dos produtos a apresentar será pedida ao utilizador através de "prompt"
	 * @memberof Menu
	 * @param {Menu} [menu=Menu.default] - ementa para apresentar a informação.
	 */
	Menu.search = function (menu = Menu.default) {
		let description = prompt(
			"Indique parte da descrição do produto a procurar:"
		);
		if (description) {
			menu.search(description);
			menu.show(); // Make sure to show the updated menu after search
		}
	};

	/**
	 * Ordena os produtos da ementa utilizando a comparação da propriedade indicada
	 * @memberof Menu
	 * @param {string} property - propriedade do produto que servirá de comparação na ordenação.
	 * @param {Menu} [menu=Menu.default] - ementa para apresentar a informação.
	 */
	Menu.sort = function (property, menu = Menu.default) {
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
	};

	/**
	 * @memberof Menu
	 * @property {Menu} default - Ementa por omissão: contém os dados de teste.
	 */
	Menu.default = new Menu().addProducts(
		new Product("Arroz de Marisco", "P", 15.0),
		new Product("Choco Frito", "P", 10.0),
		new Product("Arroz Doce", "S", 2.5),
		new Product("Pão", "E", 0.8),
		new Product("Água", "B", 1.2)
	);
});

//window.onload = init;
