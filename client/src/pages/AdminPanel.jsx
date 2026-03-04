import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiUsers, FiChevronDown } from 'react-icons/fi';
import './AdminPanel.css';

const JOB_TYPES = ['Full-time', 'Internship', 'Remote', 'Part-time'];

const INITIAL_FORM = {
    title: '', company: '', location: '', type: 'Full-time', description: '', salary: '',
};

/**
 * AdminPanel – add new jobs and view all applicants.
 * Only accessible to admin users (enforced at route level via ProtectedRoute).
 */
const AdminPanel = () => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [posting, setPosting] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(true);
    const [activeTab, setActiveTab] = useState('post'); // 'post' | 'applicants'

    const fetchApplicants = async () => {
        try {
            const { data } = await api.get('/api/admin/applicants');
            setApplicants(data);
        } catch {
            toast.error('Failed to load applicants');
        } finally {
            setLoadingApplicants(false);
        }
    };

    useEffect(() => { fetchApplicants(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            setPosting(true);
            await api.post('/api/jobs', form);
            toast.success('Job posted successfully! 🎉');
            setForm(INITIAL_FORM);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post job');
        } finally {
            setPosting(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/admin/applicants/${id}/status`, { status });
            setApplicants((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
            toast.success(`Status updated to ${status}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const statusClass = {
        Applied: 'badge-applied',
        Shortlisted: 'badge-shortlisted',
        Rejected: 'badge-rejected',
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="page-header">
                    <h1>🛡️ Admin Panel</h1>
                    <p>Manage job listings and review applicants</p>
                </div>

                {/* Tab Navigation */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'post' ? 'active' : ''}`}
                        onClick={() => setActiveTab('post')}
                    >
                        <FiPlusCircle /> Post a Job
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'applicants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applicants')}
                    >
                        <FiUsers /> Applicants ({applicants.length})
                    </button>
                </div>

                {/* ── Post Job Tab ── */}
                {activeTab === 'post' && (
                    <div className="card admin-form-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Post New Job</h3>
                        <form onSubmit={handlePostJob} className="admin-job-form">
                            <div className="form-group">
                                <label>Job Title *</label>
                                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer Intern" required />
                            </div>
                            <div className="form-group">
                                <label>Company *</label>
                                <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. TechSpark Solutions" required />
                            </div>
                            <div className="admin-form-row">
                                <div className="form-group">
                                    <label>Location *</label>
                                    <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" required />
                                </div>
                                <div className="form-group">
                                    <label>Job Type</label>
                                    <select name="type" value={form.type} onChange={handleChange}>
                                        {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Salary / Stipend</label>
                                    <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹8 LPA" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Job Description *</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the role, responsibilities, and requirements..." required />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={posting}>
                                <FiPlusCircle /> {posting ? 'Posting...' : 'Post Job'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Applicants Tab ── */}
                {activeTab === 'applicants' && (
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem' }}>All Applicants</h3>
                        {loadingApplicants ? (
                            <div className="spinner-wrapper"><div className="spinner" /></div>
                        ) : applicants.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">👥</div>
                                <h3>No applicants yet</h3>
                                <p>Post some jobs to start receiving applications</p>
                            </div>
                        ) : (
                            <div className="applicants-table-wrapper">
                                <table className="applicants-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Job</th>
                                            <th>Company</th>
                                            <th>Skills</th>
                                            <th>Applied On</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map((app) => (
                                            <tr key={app._id}>
                                                <td>
                                                    <div className="applicant-cell">
                                                        <div className="applicant-avatar">{app.userId?.name?.charAt(0)}</div>
                                                        <div>
                                                            <div className="applicant-name">{app.userId?.name}</div>
                                                            <div className="applicant-email">{app.userId?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.jobId?.title}</td>
                                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{app.jobId?.company}</td>
                                                <td>
                                                    <div className="skills-chips-sm">
                                                        {(app.userId?.skills || []).slice(0, 2).map((s) => (
                                                            <span key={s} className="skill-chip-sm">{s}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td>
                                                    <select
                                                        className={`status-select ${app.status.toLowerCase()}`}
                                                        value={app.status}
                                                        onChange={(e) => updateStatus(app._id, e.target.value)}
                                                    >
                                                        <option>Applied</option>
                                                        <option>Shortlisted</option>
                                                        <option>Rejected</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;
