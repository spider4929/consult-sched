const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const AppointmentSchema = new Schema({ 
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' 
    },
    teacher_name: {
        type: String 
    },
    teacher_avatar: {
        type: String
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' 
    },
    student_name: {
        type: String
    },
    student_avatar: {
        type: String
    },
    text: {
        type: String, 
        required: true
    },
    accepted: {
        type: Number,
        default: 2
    },
    finished: {
        type: Boolean,
        default: false 
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    range: {
        type: []
    },
    meet_link: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
 })

 module.exports = Appointment = mongoose.model('appointment', AppointmentSchema)