const express = require('express')
const router = express.Router()
const {
    userRegister,
    loginUser,
    getMe
} = require('../controllers/userController')

// Import protect function
const { protect } = require('../middleware/authMiddleware')

router.post('/', userRegister)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router