import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                {/* Global toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1a1a2e',
                            color: '#fffffe',
                            border: '1px solid rgba(108, 71, 255, 0.3)',
                            borderRadius: '10px',
                        },
                        success: { iconTheme: { primary: '#00d4aa', secondary: '#1a1a2e' } },
                        error: { iconTheme: { primary: '#ff6b6b', secondary: '#1a1a2e' } },
                    }}
                />

                {/* Sticky Navbar */}
                <Navbar />

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Fallback */}
                    <Route
                        path="*"
                        element={
                            <div className="not-found">
                                <h1>404</h1>
                                <p>Page not found</p>
                                <a href="/" className="btn btn-primary">Go Home</a>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
