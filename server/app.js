const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors")
const connectToDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const postRoute = require("./routes/post.routes");
const nodemailer = require('nodemailer');


const app = express();
connectToDB();
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

app.use("/user", userRoutes);
app.use("/post", postRoute);

app.get("/",(req, res) => {
    res.send("App working")
})

app.listen( PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})