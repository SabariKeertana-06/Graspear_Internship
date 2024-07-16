//UserDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/Api';
import { logout, isAuthenticated } from '../services/Auth';
import NavBar from '../components/NavBar';
import { Navigate } from 'react-router-dom';
import './UserDetails.css'; 
import { Link } from 'react-router-dom';

export default function UserDetailsPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = () => {
        setLoading(true);
        getUserById(userId)
            .then((fetchedUser) => {
                setUser(fetchedUser);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <div className="user-details-page">
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-danger">Error: {error}</div>
                ) : user ? (
                    <div className="user-details-wrapper">
                        <div className="user-details-container">
                            <h2>User Details</h2>
                            <div className='wrapper2'><div className='container2'>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>Name:</th>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Gender:</th>
                                        <td>{user.gender}</td>
                                    </tr>
                                    <tr>
                                        <th>Date of Birth:</th>
                                        <td>{user.dob}</td>
                                    </tr>
                                </tbody>
                            </table></div></div><br/>
                            <p style={{textAlign:'center'}}>View Admin Dashboard: <Link to = '/admin-dashboard'>Admin Dashboard</Link></p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">No user found</div>
                )}
            </div>
        </div>
    );
}

