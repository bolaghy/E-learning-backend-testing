require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465 ,578 false for other ports
  auth: {
    user: process.env.USER, // Your Gmail address
    pass: process.env.PASS, // Your Gmail password or app password
  },
});

// Function to send a welcome email
const sendWelcomeEmail = async (email, name, role) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "Young Investor 👻",
        address: process.env.USER,
      },
      to: "cryptoniumhub@gmail.com", // list of receivers
      subject: "Welcome to Our App!",
    text: `Hello ${name}, You have sucessfully register to our E-learing platform. 
            With the role of ${role}!`,
      html: `<b>Hello ${name},</b><br>You have sucessfully register to our E-learing platform.<br> 
            With the role of ${role}!`,
    });

    console.log("Welcome email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    console.log(`Failed to send welcome email: ${error.message}`);
  }
};

// Function to send a confirmation email with a confirmation code
const sendConfirmationEmail = async (email, confirmationCode) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "Young Investor 👻",
        address: process.env.USER,
      },
      to: "cryptoniumhub@gmail.com", // list of receivers
      subject: "Confirm Your Email",
      text: `Your confirmation code is: ${confirmationCode}`,
      html: `<p>Your confirmation code is: <b>${confirmationCode}</b></p>`,
    });

    console.log("Confirmation email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    console.log(`Failed to send confirmation email: ${error.message}`);
  }
};

// Function to send a password reset email
const sendPasswordResetEmail = async (email, resetLink, resetToken) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: "Young Investor 👻",
        address: process.env.USER,
      },
      to: "cryptoniumhub@gmail.com", // list of receivers          
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetLink} or use the following code ${resetToken}`,
      html: `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetToken}">Reset Password</a>
      <p> <br> or <br> 
      use the following code ${resetToken}</P>`,       
    });

    console.log("Reset email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId }; 
  } catch (error) {
    console.error("Error sending reset email:", error);
    console.log(`Failed to send reset email: ${error.message}`);              
  }
};
 
module.exports = { sendWelcomeEmail, sendConfirmationEmail, sendPasswordResetEmail };