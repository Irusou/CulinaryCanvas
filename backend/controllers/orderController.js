const orderModel = require("../models/order");

class OrderController {
	static getOrder = async (req, res) => {
		const { table } = req.params;
		const order = await orderModel.getOrder(table);
		return res.status(201).json(order);
	};

	static updateOrder = async (req, res) => {
		const { id } = req.params;
		const order = await orderModel.updateOrder(id, req.body);
		return res.status(201).json(order);
	};

	static addToOrder = async (req, res) => {
		const { table } = req.params;
		const order = await orderModel.addToOrder(table, req.body);
		return res.status(201).json(order);
	};

	static deleteOrder = async (req, res) => {
		const { id } = req.params;
		const order = await orderModel.deleteOrder(id);

		return res.status(201).json(order);
	};
}

module.exports = OrderController;
