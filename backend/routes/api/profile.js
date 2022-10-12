const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['first_name', 'last_name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ errors: [ { msg: "There is no profile for this user." } ] })
        }

        res.json(profile)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [ auth, [
    check('courses', 'Courses is required').not().isEmpty()
] ], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { courses, facebook, linkedin } = req.body

    // Build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (courses) {
        profileFields.courses = courses.split(',').map(course => course.trim())
    }

    // Build social object
    profileFields.social = {}
    if (facebook) profileFields.social.facebook = facebook 
    if (linkedin) profileFields.social.linkedin = linkedin

    try {
        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true  })
            return res.json(profile)
        }

        // Create
        profile = new Profile(profileFields)

        await profile.save()
        res.json(profile)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/profile/students
// @desc    Get all student profiles
// @access  Private
router.get('/students', auth, async (req, res) => {
    try {
        let user = await User.find({ role: 1 })
        const profiles = await Profile.find({ user }).populate('user', ['first_name', 'last_name', 'avatar'])
        res.json(profiles)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/profile/teachers
// @desc    Get all teacher profiles
// @access  Private
router.get('/teachers', auth, async (req, res) => {
    try {
        let user = await User.find({ role: 2 })
        const profiles = await Profile.find({ user }).populate('user', ['first_name', 'last_name', 'avatar'])
        res.json(profiles)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user ID
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['first_name', 'last_name', 'avatar'])

        if (!profile) return res.status(400).json({ errors: [ { msg: "Profile not found." } ] })
        
        res.json(profile)
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ errors: [ { msg: "Profile not found." } ] })
        }
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/profile
// @desc    Delete profile
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: 'User deleted' })
    } catch(err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ errors: [ { msg: "Profile not found." } ] })
        }
        res.status(500).send('Server Error')
    }
})

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education',[ auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
] ], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { school, degree, fieldofstudy, from, to, current } = req.body

    const newEdu = { school, degree, fieldofstudy, from, to, current }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(newEdu)

        await profile.save()

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router