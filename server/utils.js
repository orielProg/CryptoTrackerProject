const express = require("express");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cryptoRoute = require("./routes/cryptoEndPoints");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("", authRoute);
app.use("/app", cryptoRoute);

module.exports = app;
