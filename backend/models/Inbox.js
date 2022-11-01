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
    student_disabled: {
        type: Boolean,
        default: false
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    teacher_name: {
        type: String
    },
    teacher_disabled: {
        type: Boolean,
        default: false
    },
    message: [
        {
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            from_name: {
                type: String
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            to_name: {
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