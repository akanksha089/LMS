require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      mongoose.connection.close();
      return;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash("admin", 10);

    // Create Admin User
    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin User Created!");

    // Close DB Connection
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.connection.close();
  }
};

// Run the function
createAdmin();
