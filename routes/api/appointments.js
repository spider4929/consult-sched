const express = require('express')
const router = express.Router()

// @route   GET api/appointments
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Appointments route'))

module.exports = router