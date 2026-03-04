import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiBriefcase } from 'react-icons/fi';
import JobCard from '../components/JobCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Jobs.css';

const JOB_TYPES = ['All', 'Full-time', 'Internship', 'Remote', 'Part-time'];

/**
 * Jobs page – Displays filterable, searchable job listings grid.
 */
const Jobs = () => {
    const { isAuthenticated } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('All');
    const [appliedJobIds, setAppliedJobIds] = useState([]);

    // Fetch user's applications to mark already-applied jobs
    useEffect(() => {
        if (isAuthenticated) {
            api.get('/api/applications').then(({ data }) => {
                setAppliedJobIds(data.map((app) => app.jobId?._id));
            }).catch(() => { });
        }
    }, [isAuthenticated]);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (location) params.location = location;
            if (type !== 'All') params.type = type;
            const { data } = await api.get('/api/jobs', { params });
            setJobs(data);
        } catch {
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [search, location, type]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => fetchJobs(), 400);
        return () => clearTimeout(timer);
    }, [fetchJobs]);

    const handleApply = (jobId) => {
        setAppliedJobIds((prev) => [...prev, jobId]);
    };

    return (
        <div className="page-wrapper jobs-page">
            <div className="container">

                {/* Header */}
                <div className="page-header">
                    <h1>Find Your <span className="gradient-text">Perfect Job</span></h1>
                    <p>Browse {jobs.length} opportunities matched for freshers & students</p>
                </div>

                {/* Search & Filters */}
                <div className="jobs-filters card">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by title or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-row">
                        <div className="filter-item">
                            <FiMapPin size={15} />
                            <input
                                type="text"
                                placeholder="Filter by location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="type-filters">
                            {JOB_TYPES.map((t) => (
                                <button
                                    key={t}
                                    className={`type-btn ${type === t ? 'active' : ''}`}
                                    onClick={() => setType(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="spinner-wrapper"><div className="spinner" /></div>
                ) : jobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No jobs found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                appliedJobIds={appliedJobIds}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Jobs;
