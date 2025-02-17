const dotenv = require("dotenv");
dotenv.config();
const { connectCloudinary, cloudinary } = require("./config/cloudinary")
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

const app = express();
connectToDB();
connectCloudinary();


const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors());

// Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
