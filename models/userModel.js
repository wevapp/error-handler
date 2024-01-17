const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname : {
        type : String,
        required : [true, 'Please add your fullname']
    },
    username : {
        type : String,
        required : [true, 'Required Username'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'Need provide password']
    },
}, {timestamps : true})

module.exports = mongoose.model('User', userSchema)