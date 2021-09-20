const router = require("express").Router();
const Cart = require("../models/Cart.js");
const {
	verifyToken,
	verifyTokenAndAuth,
	verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

/***
 * USER OPTIONS
 */

// Get user cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
	try {
		const cart = await Cart.findOne({ userId: req.params.userId });
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Create a cart
router.post("/", verifyToken, async (req, res) => {
	const newCart = new Cart(req.body);
	try {
		const savedCart = await newCart.save();
		res.status(201).json(savedCart);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Update a cart
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
	try {
		const udpatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(udpatedCart);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Delete a cart
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);
		res.status(200).json("Your cart was deleted");
	} catch (error) {
		res.status(500).json(error);
	}
});

/***
 * ADMIN OPTIONS
 */

// Get all carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const carts = await Cart.find();
		res.status(200).json(carts);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
