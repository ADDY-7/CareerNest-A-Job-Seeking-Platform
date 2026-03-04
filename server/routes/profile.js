const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Multer storage config – saves resumes to server/uploads/resumes/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/resumes'));
    },
    filename: (req, file, cb) => {
        // Prefix with userId to avoid name collisions
        const uniqueName = `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX files are allowed'));
        }
    },
});

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user name and skills
 * @access  Private
 */
router.put('/', protect, async (req, res) => {
    try {
        const { name, skills } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (skills) user.skills = skills;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            skills: user.skills,
            resumePath: user.resumePath,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

/**
 * @route   POST /api/profile/resume
 * @desc    Upload resume file
 * @access  Private
 * @note    File path stored in DB – cloud-ready (replace with S3 URL later)
 */
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        // Store relative path – replace with S3 URL in production
        user.resumePath = `/uploads/resumes/${req.file.filename}`;
        await user.save();

        res.json({ message: 'Resume uploaded successfully', resumePath: user.resumePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error uploading resume' });
    }
});

module.exports = router;
