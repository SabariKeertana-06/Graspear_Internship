//Dashboard.js
import React, { useState, useEffect } from "react";
import './Dashboard.css';
import { UserDetailsApi } from "../services/Api";
import NavBar from "../components/NavBar";
import { logout, isAuthenticated } from "../services/Auth";
import { useNavigate, Link, Navigate } from "react-router-dom";
import ToDoList from "./ToDoList";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", localId: "" });
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await UserDetailsApi();
                if (response.data.users.length > 0) {
                    setUser({
                        name: response.data.users[0].displayName,
                        email: response.data.users[0].email,
                        localId: response.data.users[0].localId,
                    });
                    setLoading(false);
                } else {
                    setLoading(false);
                    console.error("No user details found.");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchUserDetails();
        }
    }, []);

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    const updateProgress = (completedTasks, totalTasks) => {
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        setProgress(progress);
    };

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <section className="dashboard-page">
                <div className="dashboard-wrapper">
                    <div className="dashboard-background"></div>
                    <div className="dashboard-container">
                        <h2 className="text-center">Dashboard Page</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                <p style={{ textAlign: 'left' }}>Hello {user.name},</p>
                                <p style={{ textAlign: "justify" }}>Welcome to your ultimate productivity companion! Our to-do list is designed to transform your daily chaos into clear, achievable tasks. With a sleek and intuitive interface, you can effortlessly organize, prioritize, and conquer your to-dos. Whether you're planning your day, setting goals, or simply managing your routine, this helps you to stay on top of your responsibilities with ease and inspiration. Turn your to-dos into ta-das and make every moment count with our seamless and efficient task manager. Elevate your productivity and achieve your dreams, one task at a time.</p><br/>
                                <ToDoList updateProgress={updateProgress} /><br/>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
