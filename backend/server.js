require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
// ROUTES
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const progressRoutes = require("./routes/progress");
const errorHandler = require("./middleware/errorHandler");
const aiRoutes = require("./routes/ai");


connectDB();

const app = express();
app.use(cors());

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use(errorHandler);
app.use("/api/ai", aiRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});