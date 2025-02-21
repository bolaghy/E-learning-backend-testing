const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter to allow only images
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

// Initialize Multer
const upload = multer({
    storage: storage,
    //fileFilter: fileFilter,
    //limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;        