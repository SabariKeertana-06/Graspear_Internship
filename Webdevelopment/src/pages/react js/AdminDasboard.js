//AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { getUsers, deleteUserById } from '../services/Api';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { logout, isAuthenticated } from '../services/Auth';
import NavBar from '../components/NavBar';
import { Navigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserDetailsApi } from '../services/Api'; 

export default function AdminDashboardPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [user, setUser] = useState({ email: '' }); 
    const [isSortedAscending, setIsSortedAscending] = useState(true); // Sorting state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserDetailsApi();
                if (response.data.users.length > 0) {
                    setUser({
                        email: response.data.users[0].email,
                    });
                    if (!response.data.users[0].email.endsWith('@admin.com')) {
                        navigate('/login'); 
                    }
                } else {
                    console.error("No user details found.");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (isAuthenticated()) {
            fetchUserDetails();
        } else {
            navigate('/login'); 
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        getUsers()
        .then((fetchedUsers) => {
            setUsers(fetchedUsers);
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

    const handleViewDetails = (userId) => {
        navigate(`/user-details/${userId}`);
    };

    const handleEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUserById(userId)
            .then(() => {
                fetchUsers();
            })
            .catch((err) => {
                setError(err.message);
            });
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleGenderFilterChange = (event) => {
        setFilterGender(event.target.value);
    };

    const handleRoleFilterChange = (event) => {
        setFilterRole(event.target.value);
    };

    const handleSortByName = () => {
        const sortedUsers = [...users].sort((a, b) => {
            if (isSortedAscending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setUsers(sortedUsers);
        setIsSortedAscending(!isSortedAscending);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = filterGender ? user.gender === filterGender : true;
        const matchesRole = filterRole ? user.email.endsWith('@gmail.com') ? filterRole === 'User' : filterRole === 'Admin' : true;
        return matchesSearchTerm && matchesGender && matchesRole;
    });

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <div className="admin-dashboard-page">
                <div className="admin-dashboard-wrapper">
                    <div className="admin-dashboard-container">
                        <header className="admin-header">
                            <h2>Admin Dashboard</h2>
                            <p style={{ textAlign: 'left' }}>
                                Hello Admin, Welcome to the Dashboard Page. Feel free to navigate through the dashboard using
                                the menu on the left to access different functionalities. Thank you for your dedication and
                                contributions to our platform's success!
                            </p>
                        </header>
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                        <div className="filter-container">
                            <select value={filterGender} onChange={handleGenderFilterChange} className="filter-dropdown">
                                <option value="">Filter By Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <select value={filterRole} onChange={handleRoleFilterChange} className="filter-dropdown">
                                <option value="">Filter By Role</option>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <button className="btn btn-primary" onClick={handleSortByName}>
                                 {isSortedAscending ? '▲' : '▼'}
                            </button>
                        </div><br />
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-danger">Error: {error}</div>
                        ) : (
                            <div className="users-list-container">
                                <h5 style={{ textAlign: 'center' }}>Registered Users ({filteredUsers.length})</h5>
                                <div className="users-list">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Gender</th>
                                                <th>DoB</th>
                                                <th>Role</th>
                                                <th style={{ width: '20%', textAlign: 'left' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.gender}</td>
                                                    <td>{user.dob}</td>
                                                    <td>{user.email.endsWith('@gmail.com') ? "User" : "Admin"}</td>
                                                    <td style={{ maxWidth: '100px', minWidth: '100px', width: '100%' }}>
                                                        <button
                                                            className="btn icon-button"
                                                            onClick={() => handleViewDetails(user.id)}
                                                        >
                                                            <VisibilityIcon />
                                                        </button>
                                                        <button
                                                            className="btn icon-button"
                                                            onClick={() => handleEditUser(user.id)}
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            className="btn icon-button"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

