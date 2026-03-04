import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiEdit3, FiUpload, FiSave, FiUser, FiMail, FiTag } from 'react-icons/fi';
import './Profile.css';

/**
 * Profile page – view/edit user details, skills, and upload resume.
 */
const Profile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', skills: '' });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        api.get('/api/profile').then(({ data }) => {
            setProfile(data);
            setForm({ name: data.name, skills: data.skills.join(', ') });
        }).catch(() => {
            toast.error('Failed to load profile');
        }).finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const skillsArr = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
            const { data } = await api.put('/api/profile', { name: form.name, skills: skillsArr });
            setProfile(data);
            setUser((prev) => ({ ...prev, name: data.name, skills: data.skills }));
            setEditing(false);
            toast.success('Profile updated! ✅');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setUploading(true);
            const { data } = await api.post('/api/profile/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile((prev) => ({ ...prev, resumePath: data.resumePath }));
            toast.success('Resume uploaded successfully! 📄');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="spinner-wrapper" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

    return (
        <div className="page-wrapper">
            <div className="container profile-container">

                {/* Profile Card */}
                <div className="profile-card card">
                    <div className="profile-avatar">
                        {profile?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-header-info">
                        <h2>{profile?.name}</h2>
                        <span className="profile-email"><FiMail size={14} /> {profile?.email}</span>
                        {profile?.isAdmin && <span className="badge badge-shortlisted" style={{ marginTop: '0.5rem' }}>Admin</span>}
                    </div>
                    <button className="btn btn-outline btn-sm edit-btn" onClick={() => setEditing(!editing)}>
                        <FiEdit3 /> {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div className="profile-grid">

                    {/* Details / Edit form */}
                    <div className="card">
                        <h3 className="section-title"><FiUser /> Profile Details</h3>
                        {editing ? (
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Skills (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={form.skills}
                                        onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                        placeholder="React, Node.js, Python..."
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                    <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="profile-details">
                                <div className="detail-row">
                                    <span className="detail-label"><FiUser /> Name</span>
                                    <span>{profile?.name}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label"><FiMail /> Email</span>
                                    <span>{profile?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label"><FiTag /> Skills</span>
                                    <div className="skills-chips">
                                        {profile?.skills?.length > 0
                                            ? profile.skills.map((s) => (
                                                <span key={s} className="skill-chip">{s}</span>
                                            ))
                                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills added yet</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resume Upload */}
                    <div className="card resume-card">
                        <h3 className="section-title"><FiUpload /> Resume</h3>
                        <div
                            className="resume-drop-zone"
                            onClick={() => fileRef.current?.click()}
                        >
                            <span className="resume-icon">📄</span>
                            <p>{uploading ? 'Uploading...' : 'Click to upload or drag & drop'}</p>
                            <p className="resume-hint">PDF, DOC, DOCX up to 5MB</p>
                            <input
                                type="file"
                                ref={fileRef}
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                            />
                        </div>
                        {profile?.resumePath && (
                            <div className="resume-uploaded">
                                <FiUpload size={14} />
                                <span>Resume uploaded ✅</span>
                                <a
                                    href={`http://localhost:5000${profile.resumePath}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="resume-link"
                                >
                                    View
                                </a>
                            </div>
                        )}
                        <p className="resume-note">
                            💡 Cloud-ready: Resume paths can be replaced with AWS S3 URLs in production.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
