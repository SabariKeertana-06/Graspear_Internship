//EditUser.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../services/Api';
import './EditUser.css'; 
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import { logout } from '../services/Auth';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

const EditUserPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getUserById(userId)
            .then((fetchedUser) => {
                setUser(fetchedUser);
                setName(fetchedUser.name);
                setEmail(fetchedUser.email);
                setGender(fetchedUser.gender);
                setDob(fetchedUser.dob);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const updatedUser = { name, email, gender, dob };
        updateUser(userId, updatedUser)
            .then(() => {
                setIsSubmitting(false);
                setSuccessMessage('User updated successfully!');
                setTimeout(() => {
                    navigate('/admin-dashboard');
                }, 500); 
            })
            .catch((err) => {
                setError(err.message);
                setIsSubmitting(false);
            });
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    const logoutUser = ()=>{
        logout();
        navigate('/login')
    }

    if (loading) return <div >Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <NavBar logoutUser={logoutUser}/>
            <div className="edit-user-page">
                <div className="edit-user-wrapper">
                    <div className="edit-user-container">
                        <h2>Edit User</h2>
                        <div className='wrapper22'>
                            <div className='container22'> 
                                <form onSubmit={handleSubmit} className="manage-acc-container">
                                    <div className='wrapper21'>
                                        <div className='container21'>
                                            <div>
                                                <label className="text-bold">Name:</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-bold">Email:</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-bold">Gender:</label>
                                                <input
                                                    type="text"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                    required
                                                />
                                            </div><br/>
                                            <div>
                                                <label className="text-bold">Date of Birth:&nbsp; </label>
                                                <input
                                                    type="date"
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    required
                                                />
                                            </div><br/>
                                            <button className='save-button' type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? 'Saving...' : 'Save'}
                                            </button><br/>
                                            {successMessage && <div style={{color:'green', textAlign:'center'}}>{successMessage}</div>}<br/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div><br/>
                        <p style={{textAlign:'center'}}>View Admin Dashboard: <Link to="/admin-dashboard">Admin Dashboard</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
