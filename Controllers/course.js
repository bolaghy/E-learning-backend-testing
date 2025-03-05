const Course = require('../Models/course')
const User = require('../Models/authModel')
const mongoose = require('mongoose');
const { isValidObjectId } = require('mongoose');
const { validateCourse } = require('../helpers/validator');





// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ 
            success: true, 
            message: "Courses retrieved successfully", 
            data: courses 
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ 

            success: false,        
            message: "Internal server error", 
            error: error.message 
        });
    }                
};
                  
// Get a single course by ID
const getSingleCourse = async (req, res) => {
    const { id } = req.params; // Use 'id' instead of 'Id' for consistency

    // Validate the course ID
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({               
    //         success: false, 
    //         message: "Invalid course ID" 
    //     });
   // }                                                                                               
                     
    try {
        const course = await Course.findById(id);                                          

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Course retrieved successfully", 
            data: course 
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

const createCourse = async (req, res) => {
    const { title, description, category, instructor, price, level, lessons, quizzes,
         studentsEnrolled } = req.body;

    // Validate the request body using Joi
    const { error, value } = validateCourse(req.body);

    // If validation fails, return the error details
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map(err => err.message) // Extract error messages
        });
    }

    // Validate instructor ID to avoid cast errors
    if (!mongoose.Types.ObjectId.isValid(value.instructor)) {
        return res.status(400).json({
            success: false,
            message: "Invalid instructor ID"
        });
    }

    try {
        // Create the course using validated data
        const newCourse = await Course.create({
            title: value.title,
            description: value.description,
            category: value.category,
            instructor: value.instructor,
            price: value.price,
            level: value.level,
            lessons: value.lessons || [], // Initialize lessons if not provided
            quizzes: value.quizzes || [], // Initialize quizzes if not provided
            studentsEnrolled: value.studentsEnrolled || [] // Initialize studentsEnrolled if not provided
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse
        });
    } catch (error) {
        console.log("Error creating course:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



// Add a lesson to a course
const addLesson = async (req, res) => {
    const { courseId } = req.params;
    const { title, content, videoUrl, duration, resources } = req.body;

    // Validate courseId
    if (!isValidObjectId(courseId)) {
        return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Add the new lesson to the course
        course.lessons.push({ title, content, videoUrl, duration, resources });
        await course.save();

        res.status(200).json({ success: true, message: "Lesson added successfully", course });
    } catch (error) {
        console.error("Error adding lesson:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Enroll a student in a course
const enrollStudent = async (req, res) => {
    const { courseId, studentId } = req.params;

    // Validate courseId and studentId
    if (!isValidObjectId(courseId) || !isValidObjectId(studentId)) {
        return res.status(400).json({ success: false, message: "Invalid course ID or student ID" });
    }

    try {
        const course = await Course.findById(courseId);
        const student = await User.findById(studentId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Check if the student is already enrolled
        if (course.studentsEnrolled.includes(studentId)) {
            return res.status(400).json({ success: false, message: "Student is already enrolled in this course" });
        }

        // Enroll the student
        course.studentsEnrolled.push(studentId);
        await course.save();

        res.status(200).json({ success: true, message: "Student enrolled successfully", course });
    } catch (error) {
        console.log("Error enrolling student:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
                                              

const updateACourse = async (req, res) => {
    const { Id } = req.params;

    // Validate course ID to avoid cast errors
    if (!isValidObjectId(Id)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid course ID" 
        });
    }

    try {
        const updateCourse = await Course.findByIdAndUpdate(Id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });

        if (!updateCourse) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Course updated successfully", 
            course: updateCourse 
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }                                   
};

const deleteACourse = async (req, res) => {
    const { Id } = req.params;

    // Validate course ID to avoid cast errors
    if (!isValidObjectId(Id)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid course ID" 
        });
    }

    try {
        const deleteCourse = await Course.findByIdAndDelete(Id);

        if (!deleteCourse) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Course deleted successfully", 
            course: deleteCourse 
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
                           
  
  

module.exports = {getAllCourses, createCourse, getSingleCourse, 
                             updateACourse, deleteACourse, addLesson , enrollStudent}