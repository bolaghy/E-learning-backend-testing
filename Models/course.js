const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    resources: [{ // Additional resources like PDFs, links
        type: String,
        trim: true
    }]
}, { _id: false }); // Avoid generating IDs for subdocuments

const quizSchema = new Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctAnswer: {
        type: Number, // Index of the correct option
        required: true
    }
}, { _id: false }); // Avoid generating IDs for subdocuments

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true // Index for faster querying
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Programming', 'Design', 'Marketing', 'Business', 'Other'],
        required: true,
        index: true // Index for faster querying
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model (Instructor)
        required: true,
        index: true // Index for faster querying
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    lessons: [lessonSchema],
    quizzes: [quizSchema],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model (Students)
        index: true // Index for faster querying
    }]
}, { timestamps: true });

// Add a pre-save hook to handle versioning or other logic
courseSchema.pre('save', function(next) {
    // You can add custom logic here if needed
    next();
});

module.exports = mongoose.model('Course', courseSchema);