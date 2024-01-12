const typeModel = require("../models/type");

class TypeController {
	static getTypes = async (_req, res) => {
		const types = await typeModel.getTypes();

		return res.status(201).json(types);
	};

	static getType = async (req, res) => {
		const { id } = req.params;
		const type = await typeModel.getType(id);

		return res.status(201).json(type);
	};

	static addType = async (req, res) => {
		const type = await typeModel.addType(req.body);
		return res.status(201).json(type);
	};

	static updateType = async (req, res) => {
		const type = await typeModel.updateType(req.body);
		return res.status(201).json(type);
	};

	static deleteType = async (req, res) => {
		const { id } = req.params;
		const type = await typeModel.deleteType(id);

		return res.status(201).json(type);
	};
}

module.exports = TypeController;
