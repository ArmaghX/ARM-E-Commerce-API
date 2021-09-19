const router = require("express").Router();
const { verifyTokenAndAuth } = require("../middleware/verifyToken");
const User = require("../models/User");

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			password,
			process.env.CRYPTO_SECRET
		).toString();
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
