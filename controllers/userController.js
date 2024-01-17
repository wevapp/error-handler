const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// @desc Register user
// @route POST /api/users
// @access Public
const userRegister = asyncHandler(async (req, res) => {
    const {fullname, username, password} = req.body
    // Check if empty fields
    if(!fullname || !username || !password){
        res.status(400)
        throw new Error('Please add all fields!')
    }
    // check if user exist
    const userExist = await User.findOne({username})
    if(userExist){
        res.status(400)
        throw new Error('Username already exist! try diferent username.')
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPw = await bcrypt.hash(password, salt)

    // Register new user
    const user = await User.create({fullname, username, password: hashPw})
    if(user){
        res.status(201).json({
            message: 'Created',
            _id: user.id,
            fullname: user.fullname,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const {username, password} = req.body
    // Check if empty fields
    if(!username || !password){
        res.status(400)
        throw new Error('Please add all fields!')
    }
    // Check the user username
    const user = await User.findOne({username})
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            message: 'Welcome',
            _id: user.id,
            fullname: user.fullname,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid Username or Password!')
    }
})

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, fullname, username} = await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        fullname,
        username
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d'})
}

module.exports = {
    userRegister,
    loginUser,
    getMe
}