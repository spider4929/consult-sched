const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InboxSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    student_name: {
        type: String
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    teacher_name: {
        type: String
    },
    message: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            sender_name: {
                type: String
            },
            text: {
                type: String,
                required: true
            },
            read: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Inbox = mongoose.model('inbox', InboxSchema)