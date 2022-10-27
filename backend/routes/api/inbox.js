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
        const from = await User.findById(req.user.id).select('-password')
        const inbox = await Inbox.find({ from: from })
        for (const a of inbox) {
            if (a.to == req.params.user_id) {
                return res.status(400).json({ error: "You have already sent a message to this prof" })
            }
        }
        if (from.role === 1) {
            const to = await User.findById(req.params.user_id).select('-password')
            if (to.role != 2) {
                return res.status(400).json({ error: "You can only message towards a faculty member" })
            }

            const newInbox = new Inbox ({
                to: to.id,
                from: from.id,
                to_name: to.first_name + ' ' + to.last_name,
                from_name: from.first_name + ' ' + from.last_name
            })

            const inbox = await newInbox.save()
            inbox.message.unshift({ 
                text: req.body.text,
                from: from.id,
                from_name: from.first_name + ' ' + from.last_name })
            await inbox.save()
            

            res.json(inbox)
        } else {
            const to = await User.findById(req.params.user_id).select('-password')
            if (to.role != 1) {
                return res.status(400).json({ error: "You can only message towards a student" })
            }

            const newInbox = new Inbox ({
                to: to.id,
                from: from.id,
                to_name: to.first_name + ' ' + to.last_name,
                from_name: from.first_name + ' ' + from.last_name
            })

            const inbox = await newInbox.save()
            inbox.message.unshift({ 
                text: req.body.text,
                from: from.id,
                from_name: from.first_name + ' ' + from.last_name })
            await inbox.save()
            

            res.json(inbox)
        }
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
        const inbox = await Inbox.findOne({ _id: req.params.inbox_id })

        if (!(inbox.from != req.user.id ^ inbox.to != req.user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        inbox.message.unshift({ 
                text: req.body.text,
                from: req.user.id,
                from_name: req.user.first_name + ' ' + req.user.last_name })
        await inbox.save()

        res.json(inbox)
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

        const inbox = await Inbox.find({ user })
        res.json(inbox)
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
        if (!(inbox.from != req.user.id ^ inbox.to != req.user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }

        res.json(inbox)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/inbox/:inbox_id
// @desc    Delete user's message from inbox
// @access  Private
router.delete('/:inbox_id', auth, async (req, res) => {
    try {
        const inbox = await Inbox.findOne({ _id: req.params.inbox_id })
        if (!(inbox.from != req.user.id ^ inbox.to != req.user.id)) {
            return res.status(400).json({ error: "Unauthorized access is prohibited" })
        }
        await inbox.remove()

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
