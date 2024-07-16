// HowToUsePage.js
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { UserDetailsApi } from "../services/Api";
import { isAuthenticated } from "../services/Auth";
import { logout } from '../services/Auth';
import './HowToUse.css';
import { useNavigate } from 'react-router-dom';

export default function HowToUsePage() {
    const navigate=useNavigate();
    const [user, setUser] = useState({ email: "" });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserDetailsApi();
                if (response.data.users.length > 0) {
                    setUser({
                        email: response.data.users[0].email,
                    });
                    setLoading(false);
                }   
                else {
                    setLoading(false);
                    console.error("No user details found.");
                }
            } 
            catch (error) {
                console.error("Error fetching user details:", error);
                setLoading(false);
            }
        };
        if (isAuthenticated()) {
            fetchUserDetails();
        }
    }, []);
    const logoutUser=()=>{
        logout();
        navigate('/login')
    }
    
    return (
        <div>
            <NavBar logoutUser={logoutUser}/>
            <section className="how-to-use-page">
                <div className='how-to-use-wrapper'>
                    <div className='how-to-use-background'></div>
                    <div className="how-to-use-container">
                        <h2>Guide to Use</h2>
                        {!loading && user.email.endsWith('@admin.com') && (
                            <section className='admin-dashboard'>
                                <div className='wrapper224'>
                                    <div className='container224'>
                                        <h5>Admin Dashboard</h5>
                                        <div className='wrapper214'>
                                            <div className='container214'>
                                                <p>
                                                    As an admin, you have additional functionalities on the Admin Dashboard:
                                                </p>
                                                <ul>
                                                    <li>
                                                        View a list of registered users and their details.
                                                    </li>
                                                    <li>
                                                        Edit user details, including name, email, gender, and role.
                                                    </li>
                                                    <li>
                                                        Delete user accounts (with confirmation).
                                                    </li>
                                                    <li>
                                                        Search for users by name or email.
                                                    </li>
                                                    <li>
                                                        Filter users by gender and role.
                                                    </li>
                                                    <li>
                                                        Sort users by name in ascending or descending order.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                        <section className='ToDoList'>
                            <div className='wrapper224'>
                                <div className='container224'>
                                    <h5>To-Do List</h5>
                                    <div className='wrapper214'>
                                        <div className="container214">
                                            <p>
                                                To manage tasks efficiently on the dashboard:
                                            </p>
                                            <ul>
                                                <li>
                                                    Add new tasks by entering the task name and clicking the add icon.
                                                </li>
                                                <li>
                                                    Search for specific tasks using the search bar.
                                                </li>
                                                <li>
                                                    Mark tasks as completed by clicking the checkmark icon.
                                                </li>
                                                <li>
                                                    Clear completed tasks to mark them as incomplete.
                                                </li>
                                                <li>
                                                    Delete tasks from the list using the delete icon.
                                                </li>
                                                <li>
                                                    Track your progress with the progress tracker, which shows task completion percentage.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
}
