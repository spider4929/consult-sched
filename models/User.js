const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: 1
    },
    first_name: {
        type: String,
        required: true 
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now 
    }
})

module.exports = User = mongoose.model('user', UserSchema)