import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiGrid, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Navbar.css';

/**
 * Navbar – gradient header with responsive hamburger menu.
 * Shows different links based on auth state and admin role.
 */
const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <FiBriefcase className="logo-icon" />
                    <span>Career<span className="logo-accent">Nest</span></span>
                </Link>

                {/* Hamburger Toggle */}
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Nav Links */}
                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
                        <FiHome /> Home
                    </Link>
                    <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} onClick={closeMenu}>
                        <FiBriefcase /> Jobs
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
                                <FiGrid /> Dashboard
                            </Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMenu}>
                                <FiUser /> Profile
                            </Link>
                            {user?.isAdmin && (
                                <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={closeMenu}>
                                    <FiShield /> Admin
                                </Link>
                            )}
                        </>
                    )}

                    {/* Auth Buttons */}
                    <div className="nav-auth">
                        {isAuthenticated ? (
                            <>
                                <span className="nav-user">Hi, {user?.name?.split(' ')[0]} 👋</span>
                                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                                    <FiLogOut /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
