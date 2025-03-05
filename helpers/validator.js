const Joi = require('joi');




const userValidationSchema = Joi.object({
    name: Joi.string().required()
        .messages({
            'string.empty': 'Instructor name is required',
            'any.required': 'Instructor name is required'
        })
        .trim(), 

    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'

        }),
    confirmPassword:Joi.string()
    .valid(Joi.ref('password')) 
    .messages({
        'string.empty': 'Confirm password is required',
        'any.only': 'Passwords do not match', 
        'any.required': 'Confirm password is required'
    }),
    

    bio: Joi.string()
        .trim()
        .allow('') // Optional field, can be empty
        .messages({
            'string.base': 'Bio must be a string'
        }),

    profilePicture: Joi.string()
        .uri()
        .default('https://example.com/default-profile.png')
        .messages({
            'string.uri': 'Profile picture must be a valid URL'
        }),

    role: Joi.string()
        .valid('instructor', 'student', 'admin')
        .required()
        .messages({
            'any.only': 'Role must be either "instructor or "student" or "admin"',
            'any.required': 'Role is required'
        })
});

const loginValidationSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email or password is incorrect',
            'any.required': 'Email or password is incorrect'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Email or password is incorrect'
        })
});


const validateUser = (data) => {
    return userValidationSchema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
    return loginValidationSchema.validate(data, { abortEarly: false });
}
// Validation schema for a single lesson
const lessonSchema = Joi.object({
    title: Joi.string().required().trim(),
    content: Joi.string().required(),
    videoUrl: Joi.string().required(),
    duration: Joi.number().required().min(1), // Duration must be at least 1 minute
    resources: Joi.array().items(Joi.string().trim()).optional()
});
// Validation schema for a single quiz
const quizSchema = Joi.object({
    question: Joi.string().required().trim(),
    options: Joi.array().items(Joi.string().trim()).min(2).required(), // At least 2 options
    correctAnswer: Joi.number().required().min(0) // Index of the correct option (0-based)
});
// Main validation schema for the Course model
const courseValidationSchema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required(),
    category: Joi.string().valid('Programming', 'Design', 'Marketing', 'Business', 'Other').required(),
    instructor: Joi.string().required(), // Assuming instructor ID is a string (ObjectId)
    price: Joi.number().required().min(0), // Price cannot be negative
    level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
    lessons: Joi.array().items(lessonSchema).optional(), // Lessons are optional
    quizzes: Joi.array().items(quizSchema).optional(), // Quizzes are optional
    studentsEnrolled: Joi.array().items(Joi.string()).optional() // Array of student IDs
});

// Function to validate the course data
const validateCourse = (courseData) => {
    return courseValidationSchema.validate(courseData, { abortEarly: false });
};

module.exports = { validateUser, validateLogin, validateCourse};