const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs with optional search & filters
 * @access  Public
 * @query   search (title/company), location, type
 */
router.get('/', async (req, res) => {
    try {
        const { search, location, type } = req.query;
        const query = {};

        // Full-text style search on title or company
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (type && type !== 'All') {
            query.type = type;
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching jobs' });
    }
});

/**
 * @route   GET /api/jobs/:id
 * @desc    Get a single job by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/jobs
 * @desc    Create a new job listing (admin only)
 * @access  Private + Admin
 */
router.post(
    '/',
    protect,
    admin,
    [
        body('title').notEmpty().withMessage('Job title is required'),
        body('company').notEmpty().withMessage('Company is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, type, description, salary } = req.body;

        try {
            const job = await Job.create({
                title,
                company,
                location,
                type: type || 'Full-time',
                description,
                salary: salary || 'Not Disclosed',
                postedBy: req.user._id,
            });

            res.status(201).json(job);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error creating job' });
        }
    }
);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job (admin only)
 * @access  Private + Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
