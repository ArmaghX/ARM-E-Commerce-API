const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	const newUser = new User({
		username,
		email,
		password: CryptoJS.AES.encrypt(
			password,
			process.env.CRYPTO_SECRET
		).toString(),
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		!user && res.status(401).json("Wrong credentials!");

		const hashedPassword = CryptoJS.AES.decrypt(
			user.password,
			process.env.CRYPTO_SECRET
		);
		const registeredPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

		registeredPassword !== req.body.password &&
			res.status(401).json("Wrong credentials!");

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "3d" }
		);

		const { password, ...others } = user._doc;

		res.status(200).json({ ...others, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
