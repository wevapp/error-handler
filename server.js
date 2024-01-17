require('dotenv').config()
const colors = require('colors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

// Import Error Handler
const { errorHandler } = require('./middleware/errorMiddleware')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleDateString()} ${req.method}:${req.url}`); // Just Reminder
    next(); // use Next method
});

// Put routes Here
app.use('/api/goals', require('./routes/goalsRoute'))
app.use('/api/users', require('./routes/usersRoute'))

// Error Handler
app.use(errorHandler)

// Connect database
mongoose.connect(process.env.MONGO_URI, {dbName : 'myapplicationone'})
.then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT} and connected to database`.cyan.underline))
}).catch ((error) => {
    console.log(error)
    process.exit(1)
})
