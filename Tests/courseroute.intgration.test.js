// require('dotenv').config();
// const express = require('express');
// const request = require('supertest');
// const courseRouter = require('../Routers/courseRouter');
// const Course = require('../Models/course');
// const mongoose = require('mongoose');
// const API = process.env.api;
// const { startDatabase, stopDatabase, clearDatabase } = require('./setup'); // Import setup functions
// const jwt = require('jsonwebtoken'); // Import JWT library



// // Start the in-memory MongoDB server before all tests
// beforeAll(async () => {
//     await startDatabase(); // Start the in-memory database
// }, 10000); // Increase timeout to 10 seconds

// // Stop the in-memory MongoDB server after all tests
// afterAll(async () => {
//     await stopDatabase(); // Stop the in-memory database
// }, 10000); // Increase timeout to 10 seconds

// // Clear the database after each test
// afterEach(async () => {
//     await clearDatabase(); // Clear the database
// }, 10000); // Increase timeout to 10 seconds


// // Mock the Course model
// jest.mock('../models/courseModel');

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use(`${API}`, courseRouter);
  

// describe('Course API', () => {
//     it('should create a new course', async () => {
//         // Define a mock user object
//         const user = {
//             id: '67c2a8e4e89237b3837efb4c', // Example user ID
//             role: 'instructor', // Example role
//         };
//         // Create a JWT token for the mock user
//         const token = jwt.sign(
//             { id: 'user.id', role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1w" }
//           );

//         const newCourse = {
//             title: "JavaScript Course",
//             description: "Learn JavaScript from scratch",
//             instructor: user.id, // Generate a random ObjectId
//             price: 49.99,
//             level: "Beginner",                                                     
//         };

        
//         console.log('Generated Token:', token);
//         const { body, statusCode } = await request(app)
//             .post(`${API}/createcourse`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(newCourse);
            
//             console.log('Response:', { statusCode, body });
//         expect(statusCode).toBe(201); // 201 Created
//         expect(body).toEqual({
//             success: true,
//             course: expect.objectContaining({
//                 _id: expect.any(String),
//                 title: newCourse.title,
//                 description: newCourse.description,
//                 instructor: newCourse.instructor.toString(),
//                 price: newCourse.price,
//                 level: newCourse.level,
//             }),
//         });

//         // Verify the course was saved in the database
//         const savedCourse = await Course.findById(body.course._id);
//         expect(savedCourse).toBeDefined();
//         expect(savedCourse.title).toBe(newCourse.title);
//     });

//     it('should return a 400 error if required fields are missing', async () => {
// // Define a mock user object
// const user = {
//     id: '67c2a8e4e89237b3837efb4c', // Example user ID
//     role: 'instructor', // Example role
// };

// // Generate a valid JWT token for authentication
// const token = jwt.sign(
//     { id: user.id, role: user.role }, // Payload
//     process.env.JWT_SECRET, // Secret key
//     { expiresIn: '1w' } // Token expiration
// );
        
//         const invalidCourse = {
//             description: "Learn JavaScript from scratch",
//             price: 49.99,
//         };
       

//         const { body, statusCode } = await request(app)
//             .post(`${API}/createcourse`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(invalidCourse);

//         expect(statusCode).toBe(400); // 400 Bad Request
//         expect(body).toEqual({
//             success: false,
//             message: expect.any(String), // Error message from validation
//         });
//     });
// });