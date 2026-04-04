const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");

dotenv.config();
connectDB();

const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});