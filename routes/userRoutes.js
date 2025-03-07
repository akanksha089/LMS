const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.get("/", userController.getUsers);
router.post("/add", userController.addUser);
router.put("/edit/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
