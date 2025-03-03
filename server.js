require("dotenv").config({ path: "./.env" });
console.log("🔍 MONGO_URI:", process.env.MONGO_URI); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Connect to MongoDB
mongoose
.connect("mongodb+srv://achaturvdi089:ZscHSRdM9l7wFwv6@cluster0.2onuo.mongodb.net/lmsDatabase?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("LMS Backend is Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
