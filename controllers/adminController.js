const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔍 Received Email:", email);

        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            console.log("❌ Admin not found!");
            return res.render("adminLogin", { error: "❌ Admin not found!" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("❌ Invalid credentials!");
            return res.render("adminLogin", { error: "❌ Invalid credentials!" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        if (!req.session) {
            console.log("❌ Session error! req.session is undefined.");
            return res.render("adminLogin", { error: "❌ Session error. Try again!" });
        }

        req.session.token = token;
        req.session.adminId = admin._id;

        console.log("✅ Session before saving:", req.session);

        req.session.save(err => {
            if (err) {
                console.log("❌ Session Save Error:", err);
                return res.render("adminLogin", { error: "❌ Session save failed!" });
            }
            return res.redirect("/admin/dashboard");
        });

    } catch (error) {
        console.log("❌ Server error:", error);
        return res.status(500).render("adminLogin", { error: "❌ Server error: " + error.message });
    }
};

