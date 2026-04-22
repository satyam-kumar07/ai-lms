require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const progressRoutes = require("./routes/progress");
const aiRoutes = require("./routes/ai");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ✅ CONNECT DB
connectDB();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ CORS (important for frontend later)
app.use(
  cors({
    origin: "*",
  })
);

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});

// ✅ ERROR HANDLER (must be LAST)
app.use(errorHandler);

// ✅ IMPORTANT: DYNAMIC PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});