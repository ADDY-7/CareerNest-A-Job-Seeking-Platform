import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

/**
 * Login page – email/password form integrated with AuthContext.
 */
const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            await login(form.email, form.password);
            toast.success('Welcome back! 👋');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>🪹</span>
                </div>
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to your CareerNest account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : <><FiLogIn /> Sign In</>}
                    </button>
                </form>

                {/* Demo credentials hint */}
                <div style={{
                    marginTop: '1.2rem',
                    padding: '0.75rem',
                    background: 'rgba(108,71,255,0.08)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong style={{ color: 'var(--primary-light)' }}>Demo credentials:</strong><br />
                    User: rahul@example.com / rahul123<br />
                    Admin: admin@careernest.com / admin123
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
