const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')
const http = require('http').Server(router)
const io = require('socket.io')(http)

const User = require('../../models/User')

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        // See if credentials are valid
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' })
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err

            // json response for login
            io.on('connection', () => {
                console.log('a user is connected')
            })
            res.json({ token, role: user.role })

        })
        
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router