const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goalSchema = new Schema({
    user : { // RESTFUL API
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    text : {
        type : String,
        required : [true, 'Add your goal']
    },
}, {timestamps : true})

module.exports = mongoose.model('Goals', goalSchema)