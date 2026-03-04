import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiZap, FiTrendingUp, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './Home.css';

const features = [
    {
        icon: '🎯',
        title: 'Smart Matching',
        desc: 'Our algorithm finds jobs that perfectly match your skills and experience level.',
    },
    {
        icon: '⚡',
        title: 'Easy Apply',
        desc: 'Apply to multiple jobs with a single click. No lengthy forms or repeated data entry.',
    },
    {
        icon: '📊',
        title: 'Track Status',
        desc: 'Monitor all your applications in one dashboard. Know when you\'re shortlisted instantly.',
    },
];

const stats = [
    { value: '10,000+', label: 'Active Jobs' },
    { value: '5,000+', label: 'Companies' },
    { value: '50,000+', label: 'Students Hired' },
];

/**
 * Home page – Landing page with hero, stats, features, and CTA sections.
 */
const Home = () => {
    return (
        <div className="home-page">

            {/* ── Hero Section ── */}
            <section className="hero">
                <div className="hero-bg-orb orb-1" />
                <div className="hero-bg-orb orb-2" />
                <div className="container hero-content">
                    <div className="hero-badge">
                        <FiZap size={14} /> Built for Students &amp; Freshers
                    </div>
                    <h1 className="hero-title">
                        Launch Your <span className="gradient-text">Dream Career</span><br />
                        with CareerNest
                    </h1>
                    <p className="hero-subtitle">
                        Discover thousands of internships, remote jobs, and full-time opportunities
                        specially curated for students and fresh graduates.
                    </p>
                    <div className="hero-actions">
                        <Link to="/jobs" className="btn btn-primary">
                            <FiSearch /> Browse Jobs <FiArrowRight />
                        </Link>
                        <Link to="/register" className="btn btn-outline">
                            Create Free Account
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="hero-trust">
                        {['No fees, ever', 'Verified companies', 'Instant notifications'].map((t) => (
                            <span key={t} className="trust-item">
                                <FiCheckCircle size={14} /> {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section className="stats-bar">
                <div className="container stats-grid">
                    {stats.map((s) => (
                        <div key={s.label} className="stat-item">
                            <span className="stat-value gradient-text">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Students Choose <span className="gradient-text">CareerNest</span></h2>
                        <p>Everything you need to kickstart your professional journey</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f) => (
                            <div key={f.title} className="feature-card card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-bg-orb" />
                        <h2>Ready to Find Your Dream Job?</h2>
                        <p>Join thousands of students who've already landed their first role.</p>
                        <div className="cta-actions">
                            <Link to="/register" className="btn btn-primary">
                                Get Started – It's Free <FiArrowRight />
                            </Link>
                            <Link to="/jobs" className="btn btn-outline">Browse All Jobs</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
