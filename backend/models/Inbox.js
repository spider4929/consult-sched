const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InboxSchema = new Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    to_name: {
        type: String
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    from_name: {
        type: String
    },
    message: [
        {
            text: {
                type: String,
                required: true
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