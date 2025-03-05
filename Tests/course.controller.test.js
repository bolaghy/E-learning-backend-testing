require('dotenv').config(); // Load environment variables
const request = require('supertest');
const express = require('express');
const User = require('../Models/authModel');
const Course = require('../Models/course');
const jwt = require('jsonwebtoken'); // Import JWT library
const courseRouter = require('../Routers/courseRouter');
const mongoose = require('mongoose');
const { startDatabase, stopDatabase, clearDatabase } = require('./setup'); // Import setup functions


// Initialize Express app
const app = express();
// Start the in-memory MongoDB server before all tests
beforeAll(async () => {
    await startDatabase(); // Start the in-memory database
}, 20000); // Increase timeout to 10 seconds

// Stop the in-memory MongoDB server after all tests
afterAll(async () => {
    await stopDatabase(); // Stop the in-memory database
}, 20000); // Increase timeout to 10 seconds         

// Clear the database after each test
afterEach(async () => {
    await clearDatabase(); // Clear the database
}, 20000); // Increase timeout to 10 seconds

// Mock the Course model
jest.mock('../models/course');



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
//app.use(`${API}`, courseRouter);


describe('Course Controller', () => {
    let instructorId;
    let studentId;
    let courseId;
    let instructorToken;
    let studentToken;

    // Create a test instructor and student before running the tests
    beforeAll(async () => {
        const instructor = await User.create({
            name: 'Instructor John',
            email: 'instructor@example.com',
            password: 'password123',
            role: 'instructor',
        });
        instructorId = instructor._id;

        let student = await User.create({
            name: 'Student Jane',
            email: 'student@example.com',
            password: 'password123',
            role: 'student',
        });
        studentId = student._id;

        // Generate JWT tokens for the instructor and student
        // Define a mock user object
            let instructorToken = {
            id: '67c2a8e4e89237b3837efb4c', // Example user ID
            role: 'instructor', // Example role
        };
        instructorToken = jwt.sign(
            { id: instructorId, role: 'instructor' },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );

        let studentToken = {
            id: '67c2a8e4e89237b3837efb4c', // Example user ID
            role: 'student', // Example role
        };

        studentToken = jwt.sign(
            { id: studentId, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );
    });
    console.log('Generated Token:', instructorToken);
    console.log('Generated Token:', studentToken);       

    // Test creating a course (requires instructor role)
    describe('Create Course', () => {
        it('should create a new course (instructor role)', async () => {
            const courseData = {
                title: 'Test Course',
                description: 'This is a test course',
                category: 'Programming',
                instructor: instructorId,
                price: 100,
                level: 'Beginner',
            };

            const res = await request(app)
                .post('/courses')
                .set('Authorization', `Bearer ${instructorToken}`) // Include instructor token
                .send(courseData);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.course).toHaveProperty('_id');
            expect(res.body.course.title).toBe(courseData.title);

            // Save the course ID for later tests
            courseId = res.body.course._id;
        });

        it('should return 403 for unauthorized role (student role)', async () => {
            const courseData = {
                title: 'Test Course',
                description: 'This is a test course',
                category: 'Programming',
                instructor: instructorId,
                price: 100,
                level: 'Beginner',
            };

            const res = await request(app)
                .post('/courses')
                .set('Authorization', `Bearer ${studentToken}`) // Include student token
                .send(courseData);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: Instructor role required');
        });

        it('should return 401 for missing token', async () => {
            const courseData = {
                title: 'Test Course',
                description: 'This is a test course',
                category: 'Programming',
                instructor: instructorId,
                price: 100,
                level: 'Beginner',
            };

            const res = await request(app)
                .post('/courses')
                .send(courseData);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: No token provided');
        });
    });

    // Test getting all courses (no authentication required)
    describe('Get All Courses', () => {
        it('should get all courses', async () => {
            const res = await request(app)
                .get('/courses');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeInstanceOf(Array);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    // Test getting a single course by ID (no authentication required)
    describe('Get Single Course', () => {
        it('should get a single course by ID', async () => {
            const res = await request(app)
                .get(`/courses/${courseId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(courseId.toString());
        });

        it('should return 404 for non-existent course ID', async () => {
            const nonExistentCourseId = new mongoose.Types.ObjectId(); // Random ObjectId
            const res = await request(app)
                .get(`/courses/${nonExistentCourseId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Course not found');
        });

        it('should return 400 for invalid course ID', async () => {
            const invalidCourseId = 'invalid-course-id';
            const res = await request(app)
                .get(`/courses/${invalidCourseId}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid course ID');
        });
    });

    // Test updating a course (requires instructor role)
    describe('Update Course', () => {
        it('should update a course (instructor role)', async () => {
            const updatedData = {
                title: 'Updated Test Course',
                description: 'This is an updated test course',
            };

            const res = await request(app)
                .put(`/courses/${courseId}`)
                .set('Authorization', `Bearer ${instructorToken}`) // Include instructor token
                .send(updatedData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.course.title).toBe(updatedData.title);
            expect(res.body.course.description).toBe(updatedData.description);
        });

        it('should return 403 for unauthorized role (student role)', async () => {
            const updatedData = {
                title: 'Updated Test Course',
                description: 'This is an updated test course',
            };

            const res = await request(app)
                .put(`/courses/${courseId}`)
                .set('Authorization', `Bearer ${studentToken}`) // Include student token
                .send(updatedData);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: Instructor role required');
        });

        it('should return 401 for missing token', async () => {
            const updatedData = {
                title: 'Updated Test Course',
                description: 'This is an updated test course',
            };

            const res = await request(app)
                .put(`/courses/${courseId}`)
                .send(updatedData);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: No token provided');
        });
    });

    // Test deleting a course (requires instructor role)
    describe('Delete Course', () => {
        it('should delete a course (instructor role)', async () => {
            const res = await request(app)
                .delete(`/courses/${courseId}`)
                .set('Authorization', `Bearer ${instructorToken}`); // Include instructor token

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.course._id).toBe(courseId.toString());

            // Verify that the course is deleted
            const deletedCourse = await Course.findById(courseId);
            expect(deletedCourse).toBeNull();
        });

        it('should return 403 for unauthorized role (student role)', async () => {
            const res = await request(app)
                .delete(`/courses/${courseId}`)
                .set('Authorization', `Bearer ${studentToken}`); // Include student token

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: Instructor role required');
        });

        it('should return 401 for missing token', async () => {
            const res = await request(app)
                .delete(`/courses/${courseId}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Unauthorized: No token provided');
        });
    });
});