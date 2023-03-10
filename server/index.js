const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cryptoRoute = require("./routes/cryptoEndPoints");


(async () => {
    try {
        dotenv.config({ path: "./server/.env" });
        dbconnect = process.env.DB_CONNECT

        await mongoose.connect(dbconnect);
        console.log("DB connected")

        app.use(express.json());
        app.use(cookieParser());

        app.use("", authRoute);
        app.use("/app", cryptoRoute);


        app.listen(5000, () => console.log("Server Running"));
    } catch (e) {
        console.log(e)
    }
})();




