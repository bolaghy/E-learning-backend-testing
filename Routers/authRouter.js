const router = require('express').Router()
const {register, login, confirmEmail, getAllUsers} = require('../Controllers/authController')
const {requestPasswordReset, resetPassword} = require('../Controllers/resetPasswordCon')
const {roleMiddleware, authMiddleware} = require('../Middleware/authMiddleware')


router.route(`/register`).post(register)
router.route(`/login`).post(login)
router.route(`/confirm-mail`).post( confirmEmail) //authMiddleware, 
router.route(`/reset-password-link`).post(authMiddleware, requestPasswordReset)   
router.route(`/reset-password`).post(authMiddleware, resetPassword)
router.route(`/users`).get( roleMiddleware([authMiddleware,"instructor"]), getAllUsers)//

module.exports = router      