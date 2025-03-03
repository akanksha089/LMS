const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Create Course
router.post("/create", async (req, res) => {
  const { title, description, teacher } = req.body;
  try {
    const newCourse = new Course({ title, description, teacher });
    await newCourse.save();
    res.status(201).json({ message: "Course created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
