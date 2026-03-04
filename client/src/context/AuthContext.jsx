import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

/**
 * AuthContext – manages user session (JWT token + user info)
 * Token and user data persisted in localStorage for page refresh survival.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const saveSession = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', jwtToken);
    };

    /**
     * Register a new user
     * @param {object} formData - { name, email, password, skills }
     * @returns {object} user data
     */
    const register = useCallback(async (formData) => {
        const { data } = await api.post('/api/auth/register', formData);
        saveSession(
            { _id: data._id, name: data.name, email: data.email, skills: data.skills, isAdmin: data.isAdmin },
            data.token
        );
        return data;
    }, []);

    /**
     * Login existing user
     * @param {string} email
     * @param {string} password
     */
    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        saveSession(
            { _id: data._id, name: data.name, email: data.email, skills: data.skills, isAdmin: data.isAdmin },
            data.token
        );
        return data;
    }, []);

    /**
     * Logout – clear local storage and state
     */
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }, []);

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, register, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
