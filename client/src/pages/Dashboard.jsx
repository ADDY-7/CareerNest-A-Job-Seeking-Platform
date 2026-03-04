import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import './Dashboard.css';

/**
 * Dashboard – shows user's applied jobs with status badges.
 */
const Dashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/api/applications');
                setApplications(data);
            } catch {
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const statusClass = {
        Applied: 'badge-applied',
        Shortlisted: 'badge-shortlisted',
        Rejected: 'badge-rejected',
    };

    const counts = {
        total: applications.length,
        applied: applications.filter((a) => a.status === 'Applied').length,
        shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
        rejected: applications.filter((a) => a.status === 'Rejected').length,
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <h1>My Dashboard</h1>
                    <p>Hello, <strong>{user?.name}</strong>! Here's your job application overview.</p>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-stats">
                    {[
                        { label: 'Total Applied', value: counts.total, color: '#6c47ff' },
                        { label: 'Applied', value: counts.applied, color: '#60a5fa' },
                        { label: 'Shortlisted', value: counts.shortlisted, color: '#00d4aa' },
                        { label: 'Rejected', value: counts.rejected, color: '#ff6b6b' },
                    ].map((s) => (
                        <div key={s.label} className="stat-card card">
                            <span className="stat-card-value" style={{ color: s.color }}>{s.value}</span>
                            <span className="stat-card-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Applications List */}
                <h2 style={{ marginBottom: '1.2rem', fontSize: '1.2rem' }}>
                    <FiBriefcase style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Applications
                </h2>

                {loading ? (
                    <div className="spinner-wrapper"><div className="spinner" /></div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No applications yet</h3>
                        <p>Start applying to jobs to see them here</p>
                        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1.2rem' }}>
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map((app) => (
                            <div key={app._id} className="application-card card">
                                <div className="app-left">
                                    <div className="app-company-icon">
                                        {app.jobId?.company?.charAt(0) || '?'}
                                    </div>
                                    <div className="app-info">
                                        <h3 className="app-title">{app.jobId?.title || 'Job'}</h3>
                                        <span className="app-company">{app.jobId?.company}</span>
                                        <div className="app-meta">
                                            <span><FiMapPin size={12} /> {app.jobId?.location}</span>
                                            <span><FiCalendar size={12} /> {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="app-right">
                                    <span className={`badge ${statusClass[app.status] || 'badge-applied'}`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
