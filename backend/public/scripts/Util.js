class Util {
	constructor() {}

	static createTableLayout(tables) {}

	static createProductTable(products) {}

	static createTypeTable(types) {
		const table = document.createElement("table");
		types.forEach((type) => {
			const tr = document.createElement("tr");
			tr.textContent = type;
			table.appendChild(tr);
		});
		return table;
	}
}
