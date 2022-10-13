const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Appointment = require('../../models/Appointment')
const User = require('../../models/User')

// @route   POST api/appointments/:user_id
// @desc    Book an appointment on a teacher
// @access  Private
router.post('/:user_id', [ auth, [
    check('text', 'Text is required').not().isEmpty(),
    check('set_date', 'Date is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const student = await User.findById(req.user.id).select('-password')
        if (student.role != 1) {
            return res.status(400).json({ msg: 'Only Students can book an appointment' })
        }
        const teacher = await User.findById(req.params.user_id).select('-password')
        if (teacher.role != 2) {
            return res.status(400).json({ msg: 'You can only book towards a Teacher' })
        }
        
        const newAppointment = new Appointment ({
            text: req.body.text,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            meet_link: req.body.meet_link,
            student: student.id,
            teacher: teacher.id,
            teacher_name: teacher.first_name + ' ' + teacher.last_name,
            student_name: student.first_name + ' ' + student.last_name,
            student_avatar: student.avatar
        })

        const appointment = await newAppointment.save()

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
            return res.status(400).json({ msg: "You cannot view teacher's list of appointments" })
        }
        const appointments = await Appointment.find({ user: req.user.id })
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
            return res.status(400).json({ msg: "You cannot view student's list of appointments" })
        }
        const appointments = await Appointment.find({ user: req.user.id })
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
            return res.status(400).json({ msg: "You cannot view teacher's list of appointments" })
        }

        const appointment = await Appointment.findOne({ _id: req.params.app_id })
        
        if(appointment.accepted == 1) {
            return res.status(400).json({ msg: 'Appointment has already been accepted' })
        }

        appointment.accepted = 1 
        await appointment.save()

        res.json({ msg: 'Appointment has successfully been approved' })
    } catch (err) {
        console.error(err.message)
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
            return res.status(400).json({ msg: "You cannot delete the appointment" })
        }
        const appointment = await Appointment.findOne({ _id: req.params.app_id })
        if (appointment.accepted == 1) {
            return res.status(400).json({ msg: 'Appointment has already been approved. Please coordinate with your respective faculty member to reject the appointment before deleting it' })
        }
        await Appointment.findOneAndRemove({ _id: req.params.app_id })

        res.json({ msg: 'Appointment successfully removed' })
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Appointment not found' })
        }
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/appointments/reject/:app_id
// @desc    Reject the appointment
// @access  Private
router.delete('/reject/:app_id', auth, async (req, res) => {
    try{
        const teacher = await User.findById(req.user.id).select('-password')
        if (teacher.role != 2) {
            return res.status(400).json({ msg: "You cannot view teacher's list of appointments" })
        }
        const appointment = await Appointment.findOneAndRemove({ _id: req.params.app_id })

        if (!appointment) {
            return res.status(401).json({ msg: 'Appointment not found' })
        }

        if (appointment.accepted == 0) {
            return res.status(400).json({ msg: "Appointment already rejected" })
        }

        appointment.accepted = 0
        await appointment.save()

        res.json({ msg: 'Appointment successfully rejected' })
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Appointment not found' })
        }
        res.status(500).send('Server Error')
    }
})


module.exports = router