require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");
const path = require("path");
// const expressLayouts = require("express-ejs-layouts");

const app = express();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Middleware Configuration
app.use(cors({
    origin: "*", // Change to your frontend URL for security
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 
// app.use(expressLayouts);
// app.set("layout", "partials/layout");  

app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true for HTTPS
}));

// ✅ Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/users", userRoutes);

// ✅ Render Pages
app.get('/login', (req, res) => {
    // res.render('login', { layout: false });
    res.render('login', {  page: 'login', error: req.flash('error') });
});
app.get('/admin/dashboard', (req, res) => {
    res.render('dashboard', { page: 'dashboard' });
});

app.get('/admin/users', (req, res) => {
    res.render('users', { page: 'users' });
});
app.get("/", (req, res) => res.send("LMS Backend is Running!"));

// ✅ Export app (Used in server.js)
module.exports = app;
