// DeleteAccountPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteAccountApi } from '../services/Api';
import { logout, getCurrentUser } from '../services/Auth';
import './DeleteAccountPage.css';
import { isAuthenticated } from '../services/Auth';
import { Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function DeleteAccountPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await DeleteAccountApi(password); 
            logout();
            navigate('/login');
        } catch (error) {
            setError("Failed to delete account. Please try again.");
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <div className="delete-account-page">
                <div className="delete-account-wrapper">
                    <div className="delete-account-container">
                        <h2>Delete Account</h2>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        {error && <p className="error">{error}</p>}
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />&nbsp;
                        <button onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Delete Account"}
                        </button><br/>
                        <button onClick={handleCancel} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
