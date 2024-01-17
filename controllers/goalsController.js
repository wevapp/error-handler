const asyncHandler = require('express-async-handler')
const Goals = require('../models/goalsModel')
const User = require('../models/userModel')

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
    // The word user with small letter 'u' is a collection from database with named 'users'
    // Find the specific goals of user [include user: req.user.id inside to find method for specific user], 
    // then stored to getGoals variable
    const getGoals = await Goals.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(getGoals) // then display
})

// @desc Get Single goal
// @route GET /api/goals/:id
// @access Private
const getSingleGoal = asyncHandler(async (req, res) => {
    // Find the _id: req.params.id of Goal with user: req.user.id
    const goal = await Goals.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found!');
    }

    res.status(200).json(goal);
});

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    const { text } = req.body
    // check if the goal filleds are empty
    if(!text || text.trim() === ''){
        res.status(400)
        throw new Error('Please fill in textbox!')
    } 

    // Trim leading and trailing whitespaces from the goal text
    const trimmedText = text.trim()

    // Check if the text goal was exist
    const textExist = await Goals.findOne({ text: new RegExp(`^${trimmedText}$`, 'i') })
    if(textExist){
        res.status(400)
        throw new Error('Goal already exist!')
    }

    // Create new goal into specific user [include user: req.user.id inside to create method for specific user]
    const goal = await Goals.create({
        text: trimmedText, 
        user: req.user.id
    })
    res.status(201).json({message: `Created new goal`, text: goal.text })
})

// @desc Update goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
    const { id } = req.params
    // find the goal into database if exist
    const goal = await Goals.findById(id)
    if (!goal) {
        res.status(404);
        throw new Error('No goal record!');
    }

    // check user if existing into database 
    const user = await User.findById(req.user.id)
    if(!user) {
        res.status(401);
        throw new Error('User not found!');
    }

    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not Authorized!');
    }
    
    // Update the goal
    const updatedGoal = await Goals.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json({ message: `Updated goal ${updatedGoal}` });
});

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const { id } = req.params
    // find the goal into database if exist
    const goal = await Goals.findById(id)
    if (!goal) {
        res.status(400);
        throw new Error('No goal record!')
    }

    // check user if existing into database 
    const user = await User.findById(req.user.id)
    if(!user) {
        res.status(401);
        throw new Error('User not found!')
    }

    // make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User not Authorized!')
    }

    // Use deleteOne directly on the Mongoose model
    await Goals.deleteOne({ _id: id })
    res.status(200).json({ id: id })
});

module.exports = {
    getGoals,
    getSingleGoal,
    setGoal,
    updateGoal,
    deleteGoal,
}