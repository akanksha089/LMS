const express = require("express");
const { adminLogin } = require("../controllers/adminController");

const router = express.Router();

// 🔐 Middleware to protect admin routes
const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.token) {
        console.log("❌ Unauthorized access attempt. Redirecting to login.");
        return res.redirect("/admin/login");
    }
    next();
};

// ✅ Render Admin Login Page
router.get("/login", (req, res) => {
    if (req.session && req.session.token) {
        console.log("✅ Already logged in. Redirecting to dashboard.");
        return res.redirect("/admin/dashboard");
    }
    res.render("adminLogin", { error: null });
});

// ✅ Admin Login Route
router.post("/login", adminLogin);

// ✅ Protected Dashboard Route
router.get("/dashboard", authMiddleware, (req, res) => {
    console.log("✅ Admin accessed dashboard.");
    res.render("dashboard");
});

// ✅ Admin Logout Route
router.get("/logout", (req, res) => {
    console.log("🔓 Logging out admin...");
    req.session.destroy((err) => {
        if (err) {
            console.log("❌ Error destroying session:", err);
            return res.redirect("/admin/dashboard");
        }
        res.clearCookie("connect.sid"); // Clearing session cookie
        console.log("✅ Logged out successfully.");
        res.redirect("/admin/login");
    });
});

module.exports = router;
