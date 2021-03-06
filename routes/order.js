const router = require("express").Router();
const Order = require("../models/Order");
const {
	verifyTokenAndAdmin,
	verifyToken,
	verifyTokenAndAuth,
} = require("../middleware/verifyToken");

/***
 * USER OPTIONS
 */

// Create an order
router.post("/", verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get user orders
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
	try {
		const order = await Order.find({ userId: req.params.userId });
		res.status(200).json(order);
	} catch (err) {
		res.status(500).json(err);
	}
});

/***
 * ADMIN OPTIONS
 */

// Get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Delete order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json("Order was deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get monthly income
router.get("/income", async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(new Date().setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
	try {
		const income = await Order.aggregate([
			{
				$match: { createdAt: { $gte: previousMonth } },
			},
			{
				$project: {
					month: { $month: "$createdAt" },
					sales: "$amount",
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: "$sales" },
				},
			},
		]);
		res.status(200).json(income);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
