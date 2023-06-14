const app = require('./utils.js');
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const dotenv = require("dotenv");


async function connectToDB() {
    try {
        dotenv.config({ path: "./server/.env" });
        dbconnect = process.env.DB_CONNECT
        await mongoose.connect(dbconnect);
        console.log("DB connected")
    } catch (e) {
        console.log(e)
    }
}

(async () => {
    try {
        await connectToDB();
        app.listen(5000, () => console.log("Server Running"));}
         catch (e) {
        console.log(e)
    }
})();






