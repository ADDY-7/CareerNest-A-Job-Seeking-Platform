const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

/**
 * @route   GET /api/admin/applicants
 * @desc    Get all applications with user & job info (admin view)
 * @access  Private + Admin
 */
router.get('/applicants', protect, admin, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'name email skills')
            .populate('jobId', 'title company location type')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching applicants' });
    }
});

/**
 * @route   PUT /api/admin/applicants/:id/status
 * @desc    Update application status (admin)
 * @access  Private + Admin
 */
router.put('/applicants/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Applied', 'Shortlisted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating status' });
    }
});

module.exports = router;
