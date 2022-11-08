const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'consultsched.tipqc@outlook.com',
        pass: 'consult-sched-tipqc'
    }
})

const { formatInTimeZone } = require('date-fns-tz')
const formatToManilaTime = (time) => formatInTimeZone(time, 'Asia/Manila', 'MM dd, yyyy hh:mm a')

const Appointment = require('../../models/Appointment')
const User = require('../../models/User')

// @route   POST api/appointments/:user_id
// @desc    Book an appointment on a teacher
// @access  Private
router.post('/:user_id', [ auth, [
    check('text', 'Text is required').not().isEmpty(),
    check('start_date', 'Start Date is required').not().isEmpty(),
    check('end_date', 'End Date is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const student = await User.findById(req.user.id).select('-password')
        if (student.role != 1) {
            return res.status(400).json({ error: 'Only Students can book an appointment' })
        }
        const teacher = await User.findById(req.params.user_id).select('-password')
        if (teacher.role != 2) {
            return res.status(400).json({ error: 'You can only book towards a Teacher' })
        }

        const appointments = await Appointment.find({ teacher: req.params.user_id, accepted: 1 })

        const date1 = [moment(req.body.start_date), moment(req.body.end_date)]
        const range1 = moment.range(date1)
        for (const a of appointments) {
            const range2 = moment.range(a.range)
            if (range1.overlaps(range2)) {
                return res.status(400).json({ error: 'Conflict detected. Please contact your professor for another schedule' })
            }
        }
        
        const newAppointment = new Appointment ({
            text: req.body.text,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            range: [moment(req.body.start_date), moment(req.body.end_date)],
            meet_link: req.body.meet_link,
            student: student.id,
            teacher: teacher.id,
            teacher_name: teacher.first_name + ' ' + teacher.last_name,
            student_name: student.first_name + ' ' + student.last_name,
            teacher_email: teacher.email,
            student_email: student.email,
            student_avatar: student.avatar
        })

        const appointment = await newAppointment.save()

        const message = {
            from: "consultsched.tipqc@outlook.com",
            to: appointment.teacher_email,
            subject: "[CREATED] A consultation has been created with you",
            text: "Greetings. A student named " + appointment.student_name + " has created a consultation with you with the following details:\nTitle: " + appointment.text +"\nStart Date: " + formatToManilaTime(appointment.start_date) + "\nEnd Date: " + formatToManilaTime(appointment.end_date) + "\n\nPlease access the consultation website and approve should the schedule fit yours and reject if not."
        }
        transporter.sendMail(message, function(err, info) {
            if(err) {
                console.log(err)
                return res.status(500).send('Server Error')
            }
            console.log("Sent: " + info.response)
        })

        res.json(appointment)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/appointments/teacher
// @desc    Get teacher's list of appointments
// @access  Private
router.get('/teacher', auth, async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).select('-password')

        if (teacher.role != 2) {
            return res.status(400).json({ error: "You cannot view teacher's list of appointments" })
        }

        const appointments = await Appointment.find({ teacher: req.user.id })

        res.json(appointments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/appointments/student
// @desc    Get student's list of appointments
// @access  Private
router.get('/student', auth, async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('-password')

        if (student.role != 1) {
            return res.status(400).json({ error: "You cannot view student's list of appointments" })
        }

        const appointments = await Appointment.find({ student: req.user.id })

        res.json(appointments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/appointments/:user_id
// @desc    Get teacher's list of appointments from students
// @access  Private
router.get('/:user_id', auth, async (req, res) => {
    try {
        const teacher = await User.findById(req.params.user_id).select('-password')
        if (teacher.role != 2) {
            return res.status(400).json({ error: "You cannot view other student's list of appointments" })
        }

        const student = await User.findById(req.user.id).select('-password')
        if (student.role != 1) {
            return res.status(400).json({ error: "You cannot view other teacher's list of appointments" })
        }

        const appointments = await Appointment.find({ teacher: req.params.user_id })

        res.json(appointments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/appointments/approve/:app_id
// @desc    Approve the appointment
// @access  Private
router.put('/approve/:app_id', auth, async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).select('-password')
        if (teacher.role != 2) {
            return res.status(400).json({ error: "You cannot view teacher's list of appointments" })
        }

        const appointment = await Appointment.findOne({ _id: req.params.app_id })

        if (!appointment) {
            return res.status(401).json({ error: 'Appointment not found' })
        }

        if (teacher.id != appointment.teacher) {
            return res.status(400).json({ error: "You cannot approve another teacher's appointments" })
        }

        const appointments = await Appointment.find({ teacher: req.user.id, accepted: 1 })

        const range1 = moment.range(appointment.range)
        for (const a of appointments) {
            const range2 = moment.range(a.range)
            if (range1.overlaps(range2)) {
                return res.status(400).json({ error: 'Conflict detected. Please contact your student(s) for another schedule' })
            }
        }
        
        if(appointment.accepted == 1) {
            return res.status(400).json({ error: 'Appointment has already been accepted' })
        }
        

        appointment.accepted = 1 
        await appointment.save()

        const message = {
            from: "consultsched.tipqc@outlook.com",
            to: appointment.student_email,
            subject: "[ACCEPTED] Your consultation has been accepted!",
            text: "Greetings. Your consultation with Engr. " + appointment.teacher_name + " is accepted. Here are the details:\nTitle: " + appointment.text +"\nStart Date: " + formatToManilaTime(appointment.start_date) + "\nEnd Date: " + formatToManilaTime(appointment.end_date) + "\n\nPlease make sure that you keep in touch with your professor as the start date comes closer."
        }
        transporter.sendMail(message, function(err, info) {
            if(err) {
                console.log(err)
                return res.status(500).send('Server Error')
            }
            console.log("Sent: " + info.response)
        })

        res.json({ msg: 'Appointment has successfully been approved' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/appointments/edit/:app_id
// @desc    Edit the appointment
// @access  Private
router.put('/edit/:app_id', [ auth, [
    check('text', 'Text is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const appointment = await Appointment.findOne({ _id: req.params.app_id })
        if(!( appointment.student != user.id ^ appointment.teacher != user.id)) {
            return res.status(400).json({ error: 'Unauthorized access is prohibited' })
        }
        if (appointment.accepted == 0 || appointment.accepted == 1) {
            return res.status(400).json({ error: 'Cannot edit a rejected or accepted appointment' })
        }

        appointment.text = req.body.text
        appointment.meet_link = req.body.meet_link 
        await appointment.save()
        
        res.json(appointment)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ error: 'Appointment not found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/appointments/cancel/:app_id
// @desc    Cancel the appointment
// @access  Private
router.delete('/cancel/:app_id', auth, async (req, res) => {
    try{
        const student = await User.findById(req.user.id).select('-password')
        if (student.role != 1) {
            return res.status(400).json({ error: "You cannot delete the appointment" })
        }
        const appointment = await Appointment.findOne({ _id: req.params.app_id })

        if (!appointment) {
            return res.status(401).json({ error: 'Appointment not found' })
        }

        if (student.id != appointment.student) {
            return res.status(400).json({ error: "You cannot cancel another student's appointments" })
        }

        if (appointment.accepted == 1) {
            return res.status(400).json({ error: 'Appointment has already been approved. Please coordinate with your respective faculty member to reject the appointment before deleting it' })
        }

        await Appointment.findOneAndRemove({ _id: req.params.app_id })

        const message = {
            from: "consultsched.tipqc@outlook.com",
            to: appointment.teacher_email,
            subject: "[CANCELLED] A consultation created with you was cancelled",
            text: "Greetings. A student named " + appointment.student_name + " has cancelled a consultation with you with the following details:\nTitle: " + appointment.text +"\nStart Date: " + formatToManilaTime(appointment.start_date) + "\nEnd Date: " + formatToManilaTime(appointment.end_date) + "\n\nPlease coordinate with your respective student to know the reason for cancellation."
        }
        transporter.sendMail(message, function(err, info) {
            if(err) {
                console.log(err)
                return res.status(500).send('Server Error')
            }
            console.log("Sent: " + info.response)
        })

        res.json({ msg: 'Appointment successfully removed' })
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ error: 'Appointment not found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/appointments/reject/:app_id
// @desc    Reject the appointment
// @access  Private
router.put('/reject/:app_id', auth, async (req, res) => {
    try{
        const teacher = await User.findById(req.user.id).select('-password')

        if (teacher.role != 2) {
            return res.status(400).json({ error: "You cannot view teacher's list of appointments" })
        }
        const appointment = await Appointment.findOne({ _id: req.params.app_id })

        if (!appointment) {
            return res.status(401).json({ error: 'Appointment not found' })
        }

        if (teacher.id != appointment.teacher) {
            return res.status(400).json({ error: "You cannot reject another teacher's appointments" })
        }

        if (appointment.accepted == 0) {
            return res.status(400).json({ error: "Appointment already rejected" })
        }

        appointment.accepted = 0
        await appointment.save()

        const message = {
            from: "consultsched.tipqc@outlook.com",
            to: appointment.student_email,
            subject: "[REJECTED] Your consultation has been rejected.",
            text: "Greetings. Your consultation with Engr. " + appointment.teacher_name + " is rejected. Here are the details:\nTitle: " + appointment.text +"\nStart Date: " + formatToManilaTime(appointment.start_date) + "\nEnd Date: " + formatToManilaTime(appointment.end_date) + "\n\nPlease contact your respective faculty member to know the reason for rejection, so a new one can be created as soon as possible."
        }
        transporter.sendMail(message, function(err, info) {
            if(err) {
                console.log(err)
                return res.status(500).send('Server Error')
            }
            console.log("Sent: " + info.response)
        })

        res.json({ msg: 'Appointment successfully rejected' })
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ error: 'Appointment not found' })
        }
        res.status(500).send('Server Error')
    }
})


module.exports = router