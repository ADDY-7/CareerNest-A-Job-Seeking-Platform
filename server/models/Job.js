const mongoose = require('mongoose');

/**
 * Job Model
 * Represents a job/internship listing posted by admin.
 */
const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        // e.g. 'Full-time', 'Internship', 'Remote', 'Part-time'
        type: {
            type: String,
            enum: ['Full-time', 'Internship', 'Remote', 'Part-time'],
            default: 'Full-time',
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        // Salary / stipend as a string e.g. '₹5 LPA' or '₹15,000/month'
        salary: {
            type: String,
            default: 'Not Disclosed',
        },
        // Reference to the admin who posted this job
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
