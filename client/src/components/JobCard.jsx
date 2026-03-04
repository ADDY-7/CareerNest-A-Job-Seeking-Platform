import React, { useState } from 'react';
import { FiMapPin, FiBriefcase, FiDollarSign, FiGlobe, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

/**
 * JobCard – displays a single job listing with apply functionality.
 */
const JobCard = ({ job, appliedJobIds = [], onApply }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [applying, setApplying] = useState(false);

    const hasApplied = appliedJobIds.includes(job._id);

    // Map job type to badge class
    const typeBadgeClass = {
        'Full-time': 'badge-fulltime',
        'Internship': 'badge-internship',
        'Remote': 'badge-remote',
        'Part-time': 'badge-parttime',
    }[job.type] || 'badge-fulltime';

    const handleApply = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to apply');
            navigate('/login');
            return;
        }

        try {
            setApplying(true);
            await api.post(`/api/apply/${job._id}`);
            toast.success(`Applied to ${job.title} at ${job.company}! 🎉`);
            if (onApply) onApply(job._id);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply';
            toast.error(msg);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="job-card card">
            {/* Header */}
            <div className="job-card-header">
                <div className="job-company-icon">
                    {job.company.charAt(0)}
                </div>
                <div>
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-company">
                        <FiGlobe size={13} /> {job.company}
                    </span>
                </div>
            </div>

            {/* Meta info */}
            <div className="job-meta">
                <span className="job-meta-item">
                    <FiMapPin size={13} /> {job.location}
                </span>
                <span className={`badge ${typeBadgeClass}`}>{job.type}</span>
            </div>

            {/* Salary */}
            <div className="job-salary">
                <FiDollarSign size={14} />
                <span>{job.salary}</span>
            </div>

            {/* Description */}
            <p className="job-description">{job.description}</p>

            {/* Apply Button */}
            <div className="job-card-footer">
                {hasApplied ? (
                    <button className="btn btn-sm applied-btn" disabled>
                        <FiCheckCircle /> Applied
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleApply}
                        disabled={applying}
                    >
                        {applying ? 'Applying...' : '⚡ Apply Now'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
