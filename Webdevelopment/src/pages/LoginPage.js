// LoginPage.js

import { LoginApi } from '../services/Api';
import './LoginPage.css';
import { useState } from 'react';
import { storeUserData } from '../services/Storage';
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/FirebaseConfig';

export default function LoginPage() {
    const navigate = useNavigate();
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null,
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = { ...initialStateErrors };
        let hasError = false;

        if (inputs.email === "") {
            newErrors.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            newErrors.password.required = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            LoginApi(inputs)
                .then((response) => {
                    storeUserData(response.data.idToken);
                    signInWithEmailAndPassword(auth, inputs.email, inputs.password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                        });

                    if (inputs.email.endsWith('@admin.com')) {
                        navigate('/admin-dashboard');
                    } else if (inputs.email.endsWith('@gmail.com')) {
                        navigate('/dashboard');
                    }
                })
                .catch((err) => {
                    if (err.response?.status === 400) {
                        setErrors({ ...newErrors, custom_error: "Invalid Credentials. Forgot password?" });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setErrors(newErrors);
        }
    };

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <section className="sec1-block">
            <section className="login-page">
                <div className="login-wrapper">
                    <div className="login-background"></div>
                    <div className="row">
                        <div className="login-container">
                            <h2 className="text-center">Login Now</h2>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        onChange={handleInput}
                                        name="email"
                                        id="exampleInputEmail1"
                                        placeholder="email"
                                    />
                                    {errors.email.required && (
                                        <span className="text-danger">
                                            Email is required.
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        onChange={handleInput}
                                        placeholder="password"
                                        id="exampleInputPassword1"
                                    />
                                    {errors.password.required && (
                                        <span className="text-danger">
                                            Password is required.
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    {loading && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {errors.custom_error && (
                                        <span className="text-danger">
                                            <p>
                                                {errors.custom_error} <Link to="/reset-password">Reset Password</Link>
                                            </p>
                                        </span>
                                    )}
                                    <input
                                        type="submit"
                                        className="btn btn-login float-right"
                                        disabled={loading}
                                        value="Login"
                                    />
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Create new account? Please <Link to="/register">Register</Link><br/>
                                    Go back to <Link to="/">Home</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}
