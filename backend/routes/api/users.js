const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check')
const http = require('http').Server(router)
const io = require('socket.io')(http)

const User = require('../../models/User')

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('first_name', 'First Name is required').not().isEmpty(),
    check('last_name', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid TIP email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { role, first_name, middle_name, last_name, email, password } = req.body

    try {
        // See if user exists
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ error: 'User already exists' })
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg', 
            d: 'mm'
        })

        user = new User({
            role,
            first_name,
            middle_name,
            last_name,
            email,
            password,
            avatar
        })

        // See if it uses TIP email
        if (!user.email.includes("@tip.edu.ph")) {
            return res.status(400).json({ error: 'Please use TIP Email' })
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()

        // Student or Faculty Member
        if (user.email.includes(".cpe")) {
            user.role = 2

            await user.save()
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err

            // json response for register
            
            res.json({ token, role: user.role })
        })

        io.on('connection', () => {
            console.log('a user is connected')
        })
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router