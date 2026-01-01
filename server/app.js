const dotenv = require("dotenv");
dotenv.config();
const { connectCloudinary, cloudinary } = require("./config/cloudinary")
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const cron = require("node-cron");
const mongoose = require("mongoose");

const app = express();
connectToDB();
connectCloudinary();

// Cron job to keep MongoDB cluster alive (runs every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      console.log('MongoDB cluster pinged successfully at', new Date().toISOString());
    }
  } catch (error) {
    console.error('Error pinging MongoDB cluster:', error.message);
  }
});


const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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
