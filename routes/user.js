const router = require("express").Router();

router.get("/usertest", (req, res) => {
	res.send("user test is successfull");
});

router.post("/userposttest", (req, res) => {
	const { username } = req.body;
	res.send(`Hello ${username}`);
});

module.exports = router;
