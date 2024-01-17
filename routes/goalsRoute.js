const express = require('express')
const router = express.Router()
const {
    getGoals,
    getSingleGoal,
    setGoal,
    updateGoal,
    deleteGoal,
} = require('../controllers/goalsController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').get(protect, getSingleGoal).put(protect, updateGoal).delete(protect, deleteGoal)

module.exports = router