const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Chat = require('../../models/Chat')
const User = require('../../models/User')

// @route   POST api/chat/:user_id
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
            const temp = await Chat.find({ student: user.id })
            for (const a of temp) {
                if (a.teacher == req.params.user_id) {
                    return res.status(400).json({ error: "You have already sent a message to this prof" })
                }
            }
            const student = user
            const teacher = await User.findById(req.params.user_id).select('-password')
            if (teacher.role != 2) {
                return res.status(400).json({ error: "You can only message towards a faculty member" })
            }

            const newChat = new Chat ({
                teacher: teacher.id,
                student: student.id,
                teacher_name: teacher.first_name + ' ' + teacher.last_name,
                student_name: student.first_name + ' ' + student.last_name
            })

            const chat = await newChat.save()
            chat.message.push({
                sender: student.id,
                sender_name: student.first_name + ' ' + student.last_name,
                text: req.body.text
             })
            await chat.save()
            
            res.json(chat)
        } else {
            const temp = await Chat.find({ teacher: user.id })
            for (const a of temp) {
                if (a.student == req.params.user_id) {
                    return res.status(400).json({ error: "You have already sent a message to this prof" })
                }
            }
            const teacher = user
            const student = await User.findById(req.params.user_id).select('-password')
            if (teacher.role != 1) {
                return res.status(400).json({ error: "You can only message towards a student" })
            }

            const newChat = new Chat ({
                teacher: teacher.id,
                student: student.id,
                teacher_name: teacher.first_name + ' ' + teacher.last_name,
                student_name: student.first_name + ' ' + student.last_name
            })

            const chat = await newChat.save()
            chat.message.push({
                sender: teacher.id,
                sender_name: teacher.first_name + ' ' + teacher.last_name,
                text: req.body.text
             })
            await chat.save()
            
            res.json(chat)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/chat/me
// @desc    Get user's chat
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (user.role == 1) {
            const chat = await Chat.find({ student: user.id })
            res.json(chat)
        } else {
            const chat = await Chat.find({ teacher: user.id })
            res.json(chat)
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/chat/:chat_id
// @desc    Get user's message from chat
// @access  Private
router.get('/:chat_id', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.chat_id })
        if (!(chat.student != req.user.id ^ chat.teacher != req.user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        res.json(chat)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/chat/:chat_id
// @desc    Reply to a message
// @access  Private
router.put('/:chat_id', [ auth, [
    check('text', 'Text is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const chat = await Chat.findOne({ _id: req.params.chat_id })

        if (!(chat.student != user.id ^ chat.teacher != user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        chat.message.push({
            sender: user.id,
            sender_name: user.first_name + ' ' + user.last_name,
            text: req.body.text
        })
        await chat.save()

        res.json(chat)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
    
})

// @route   DELETE api/chat/:chat_id
// @desc    Delete user's message from chat
// @access  Private
router.delete('/:chat_id', auth, async (req, res) => {
    
})

module.exports = router
