require('dotenv').config();
const { validateUser, validateLogin } = require('../helpers/validator');
const { uploadImage } = require('../helpers/imageUpload');
const User = require('../Models/authModel');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendConfirmationEmail } = require("../helpers/sendmail");

// Function to generate a 6-digit confirmation code
const generateConfirmationCode = () => Math.floor(100000 + Math.random() * 900000);

// Register a new user (instructor or student)
const register = async (req, res) => {
  const { value, error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message)
    });
  }

  try {
    const { name, email, password, role } = value;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const confirmationCode = generateConfirmationCode();
    const profilePictureUrl = 'https://imageimage.com'; // Default image

    if (req.file) {
      const result = await uploadImage(req.file);
      profilePictureUrl = result.imageUrl;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      confirmationCode,
      profilePictureUrl
    });

    
    await sendConfirmationEmail(email, confirmationCode);

    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const confirmEmail = async (req, res) => {
  const {  email, confirmationCode } = req.body;

  try {
    const user = await User.findOne({ email, confirmationCode });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid confirmation code" });
    }
    
    await sendWelcomeEmail(email, user.name, user.role);

    user.isConfirmed = true;
    user.confirmationCode = null;
    await user.save();

    res.status(200).json({ success: true, message: "Email confirmed successfully" });
  } catch (error) {
    console.error("Email confirmation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { value, error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((err) => err.message)
    });
  }

  try {
    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Wrong Email or Password" });
    }

    const passwordMatch = await user.comparePassword(password);      
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: "Wrong Email or Password" });
    }

    if (!user.isConfirmed) {
      return res.status(400).json({ success: false, message: "Please confirm your email" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }

}                          
//   try {
//       // Validate and parse query parameters
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;

//       if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
//           return res.status(400).json({ 
//               success: false, 
//               message: "Invalid page or limit value" 
//           });
//       }

//       const skip = (page - 1) * limit;          

//       // Debugging: Log query parameters
//       console.log("Fetching users with pagination - Page:", page, "Limit:", limit);

//       // Fetch users with pagination
//       const users = await User.find()
//           .select('-password')
//           .skip(skip)
//           .limit(limit);

//       // Debugging: Log fetched users
//       console.log("Users fetched:", users);

//       // Get the total number of users for pagination metadata
//       const totalUsers = await User.countDocuments();

//       // If no users are found, return a 404 response
//       if (!users || users.length === 0) {
//           return res.status(404).json({ 
//               success: false, 
//               message: "No users found" 
//           });
//       }

//       // Return the list of users with pagination metadata
//       res.status(200).json({ 
//           success: true, 
//           message: "Users retrieved successfully", 
//           data: users,
//           pagination: {
//               totalUsers,
//               currentPage: page,
//               totalPages: Math.ceil(totalUsers / limit)
//           }
//       });
//   } catch (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ 
//           success: false, 
//           message: "Internal server error", 
//           error: error.message 
//       });
//   }
// };

module.exports = { register, login, confirmEmail,getAllUsers };