const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',['name','avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/profile
// @desc Create or update a user's profile
// @access Private
router.post(
    '/', 
    [ 
        auth, 
        [
            check('skills', 'Skills are required').not().isEmpty()
        ] 
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            location,
            bio,
            githubusername,
            skills,
            instagram,
            linkedin
        } = req.body;

        // Building profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Building social media object
        profileFields.social = {}
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile){
                // Updating profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields }, 
                    { new: true }
                );

                return res.json(profile);
            }

            // Creating profile
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if(!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/profile
// @desc Delete profile, user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove user posts
        await Post.deleteMany({ user: req.user.id });

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        
        res.json({ msg: 'User deleted' });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public
router.get('/github/:username', (req, res) =>{
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=3&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;