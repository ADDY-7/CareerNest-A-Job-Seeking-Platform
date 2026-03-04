const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/apply/:jobId
 * @desc    Apply to a job
 * @access  Private
 */
router.post('/:jobId', protect, async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check for duplicate application (unique index handles this, but better UX to check manually)
        const existing = await Application.findOne({
            userId: req.user._id,
            jobId,
        });

        if (existing) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        const application = await Application.create({
            userId: req.user._id,
            jobId,
        });

        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error applying to job' });
    }
});

/**
 * @route   GET /api/applications
 * @desc    Get all applications for the logged-in user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user._id })
            .populate('jobId', 'title company location type salary')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching applications' });
    }
});

module.exports = router;
