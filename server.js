const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("DB Connection: Sucessful"))
	.catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 4000, () => {
	console.log(`Server is running at port ${process.env.PORT}`);
});
