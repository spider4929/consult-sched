const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Inbox = require('../../models/Inbox')
const User = require('../../models/User')

// @route   POST api/inbox/:user_id
// @desc    Message a user for the first time
// @access  Private
router.post('/:user_id', [ auth, [
    check('text', 'You cannot send a blank message').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        if (user.id == req.params.user_id) {
            return res.status(400).json({ error: "You cannot send message to yourself" })
        }
        if (user.role == 1) {
            const temp = await Inbox.find({ student: user.id, student_disabled: false })
            for (const a of temp) {
                if (a.to == req.params.user_id) {
                    return res.status(400).json({ error: "You have already sent a message to this prof" })
                }
            }
            const student = user
            const teacher = await User.findById(req.params.user_id).select('-password')
            if (teacher.role != 2) {
                return res.status(400).json({ error: "You can only message towards a faculty member" })
            }

            const newInbox = new Inbox ({
                teacher: teacher.id,
                student: student.id,
                teacher_name: teacher.first_name + ' ' + teacher.last_name,
                student_name: student.first_name + ' ' + student.last_name
            })

            const inbox = await newInbox.save()
            inbox.message.unshift({
                from: student.id,
                from_name: student.first_name + ' ' + student.last_name,
                to: teacher.id,
                to_name: teacher.first_name + ' ' + teacher.last_name,
                text: req.body.text
             })
            await inbox.save()
            
            res.json(inbox)
        } else {
            const temp = await Inbox.find({ teacher: user.id, teacher_disabled: false })
            for (const a of temp) {
                if (a.to == req.params.user_id) {
                    return res.status(400).json({ error: "You have already sent a message to this prof" })
                }
            }
            const teacher = user
            const student = await User.findById(req.params.user_id).select('-password')
            if (teacher.role != 1) {
                return res.status(400).json({ error: "You can only message towards a student" })
            }

            const newInbox = new Inbox ({
                teacher: teacher.id,
                student: student.id,
                teacher_name: teacher.first_name + ' ' + teacher.last_name,
                student_name: student.first_name + ' ' + student.last_name
            })

            const inbox = await newInbox.save()
            inbox.message.unshift({
                from: teacher.id,
                from_name: teacher.first_name + ' ' + teacher.last_name,
                to: student.id,
                to_name: student.first_name + ' ' + student.last_name,
                text: req.body.text
             })
            await inbox.save()
            
            res.json(inbox)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/inbox/me
// @desc    Get user's inbox
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (user.role == 1) {
            const inbox = await Inbox.find({ student: user.id, student_disabled: false })
            res.json(inbox)
        } else {
            const inbox = await Inbox.find({ teacher: user.id, teacher_disabled: false })
            res.json(inbox)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/inbox/:inbox_id
// @desc    Get user's message from inbox
// @access  Private
router.get('/:inbox_id', auth, async (req, res) => {
    try {
        const inbox = await Inbox.findOne({ _id: req.params.inbox_id })
        if (!(inbox.student != req.user.id ^ inbox.teacher != req.user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        res.json(inbox)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/inbox/:inbox_id
// @desc    Reply to a message
// @access  Private
router.put('/:inbox_id', [ auth, [
    check('text', 'Text is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const inbox = await Inbox.findOne({ _id: req.params.inbox_id })

        if (!(inbox.student != user.id ^ inbox.teacher != user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        if (user.role == 1) {
            const teacher = await User.findById(inbox.teacher).select('-password')
            inbox.message.unshift({ 
                from: user.id,
                from_name: user.first_name + ' ' + user.last_name, 
                to: teacher.id,
                to_name: teacher.first_name + ' ' + teacher.last_name,
                text: req.body.text,
            })
            await inbox.save()

            res.json(inbox)
        } else {
            const student = await User.findById(inbox.teacher).select('-password')
            inbox.message.unshift({ 
                from: user.id,
                from_name: user.first_name + ' ' + user.last_name, 
                to: student.id,
                to_name: student.first_name + ' ' + student.last_name,
                text: req.body.text,
            })
            await inbox.save()

            res.json(inbox)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
    
})

// @route   DELETE api/inbox/delete/:inbox_id
// @desc    Delete user's message from inbox
// @access  Private
router.delete('/:inbox_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        const inbox = await Inbox.findOne({ _id: req.params.inbox_id })
        if (!(inbox.student != user.id ^ inbox.teacher != user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }
        if (user.role == 1) {
            inbox.student_disabled = true 
            await inbox.save()
        } else {
            inbox.teacher_disabled = true 
            await inbox.save()
        }

        if (inbox.student_disabled == true && inbox.teacher_disabled == true) {
            await inbox.remove()
        }

        res.json(inbox)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ error: 'Message not found' })
        }
        res.status(500).send('Server Error')
    }
    
})

module.exports = router
