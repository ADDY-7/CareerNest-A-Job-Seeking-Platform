const mongoose = require('mongoose');

/**
 * Application Model
 * Tracks which user applied for which job and the application status.
 */
const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        // Status updated by admin; defaults to 'Applied'
        status: {
            type: String,
            enum: ['Applied', 'Shortlisted', 'Rejected'],
            default: 'Applied',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Prevent duplicate applications from the same user for the same job
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
