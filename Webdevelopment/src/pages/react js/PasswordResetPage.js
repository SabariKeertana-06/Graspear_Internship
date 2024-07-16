//PasswordResetPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PasswordResetApi } from '../services/Api';
import NavBar from '../components/NavBar';
import { logout} from '../services/Auth';
import { useNavigate } from 'react-router-dom';

export default function PasswordResetPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [resetRequested, setResetRequested] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await PasswordResetApi(email);
            setResetRequested(true);
        } catch (err) {
            setError('Failed to reset password. Please try again.'); 
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <section className="login-page">
                <div className="login-wrapper">
                    <div className="login-background"></div>
                    <div className="login-container">
                        <h2 className="text-center">Reset Your Password</h2>
                        {!resetRequested ? (
                            <form onSubmit={handleSubmit} className="password-reset-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="text-uppercase">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <button type="submit" className="btn btn-reset" disabled={loading} style={{backgroundColor:"#007bff", color:"white"}}>
                                    {loading ? 'Sending Email...' : 'Send Password Reset Email'}
                                </button>
                            </form>
                        ) : (
                            <div className="reset-requested">
                                <p>
                                    An email has been sent to {email}. Please check your inbox and follow the instructions
                                    to reset your password.
                                </p>
                                <p>
                                    Go back to <Link to="/login">Login</Link>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
