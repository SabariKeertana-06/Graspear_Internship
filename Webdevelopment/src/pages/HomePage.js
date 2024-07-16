import React from 'react';
import './HomePage.css';
import { isAuthenticated } from '../services/Auth';

const HomePage = () => {
    const isLoggedIn = isAuthenticated();

    return (
        <div className="home-page">
            <div className="home-wrapper">
                <div className="home-background"></div>
                <div className="home-container">
                    <h2>Welcome to our WebPro</h2>
                    <div className="home-content">
                        <div className='wrapper222'>
                            <div className='container222'>
                                <div className="content-group">
                                    <h5>About Us</h5>
                                    <div className='wrapper212'>
                                        <div className='container212'>
                                            <p>This web application provides a robust user authentication system and an admin dashboard for user management.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='wrapper223'>
                            <div className='container223'>
                                <div className="content-group">
                                    <h5>Features</h5>
                                    <div className='wrapper213'>
                                        <div className='container213'>
                                            <ul>
                                                <li>Secure User Registration and Login</li>
                                                <li>Data Storage in Firestore</li>
                                                <li>Admin Dashboard for User Management</li>
                                                <li>Responsive Design and Intuitive Interfaces</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home-buttons">
                        {isLoggedIn ? (
                            <a href="/dashboard" className="btn1">Return to Dashboard</a>
                        ) : (
                            <>
                                <a href="/login" className="btn1">Login</a>
                                <a href="/register" className="btn1">Register</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
