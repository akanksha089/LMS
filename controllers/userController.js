const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render("user", { users });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({ name, email, password: hashedPassword, role }).save();

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error("❌ Error adding user:", error);
        res.status(500).json({ message: "Error adding user" });
    }
};


// Update user details
exports.updateUser = async (req, res) => {
    console.log("Received ID:", req.params.id); // Debugging

    if (!req.params.id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const { name, email, role } = req.body;
        if (!name || !email || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
};



// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
};
