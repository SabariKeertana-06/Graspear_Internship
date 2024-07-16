// UpdateProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserDetailsApi, UpdateProfileApi } from '../services/Api';
import { isAuthenticated } from '../services/Auth';
import './UpdateProfilePage.css';
import { logout } from '../services/Auth';
import NavBar from '../components/NavBar';

export default function UpdateProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ id: "", name: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserDetailsApi();
                if (response.data.users.length > 0) {
                    const fetchedUser = {
                        id: response.data.users[0].localId, 
                        name: response.data.users[0].displayName,
                        email: response.data.users[0].email,
                    };
                    console.log("Fetched user details:", fetchedUser); 
                    setUser(fetchedUser);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setError("No user details found.");
                }
            } 
            catch (error) {
                console.error("Error fetching user details:", error);
                setError("Error fetching user details.");
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchUserDetails();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await UpdateProfileApi(user);
            setSuccess("Profile updated successfully!");
            setLoading(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile. Please try again.");
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
            <NavBar logoutUser={logoutUser}/>
            <div className="update-profile-page">
                <div className="update-profile-wrapper">
                    <div className="update-profile-container">
                        <h2>Update Profile</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit">Update Profile Name</button>
                            </form>
                        )}
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <button onClick={handleCancel} className="cancel-button" style={{ backgroundColor:"#ff4d4d"}} >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}