// RegisterPage.js

import './RegisterPage.css';
import { useState } from 'react';
import { RegisterApi } from '../services/Api';
import { storeUserData } from '../services/Storage';
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/FirebaseConfig';
import { db } from '../services/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function RegisterPage() {
    const navigate = useNavigate();
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        name: { required: false },
        gender: { required: false },
        dob: { required: false },
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        gender: "",
        dob: "",
        
    });

    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = { ...initialStateErrors };
        let hasError = false;

        if (inputs.name === "") {
            newErrors.name.required = true;
            hasError = true;
        }
        if (inputs.email === "") {
            newErrors.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            newErrors.password.required = true;
            hasError = true;
        }
        if (inputs.gender === "") {
            newErrors.gender.required = true;
            hasError = true;
        }
        if (inputs.dob === "") {
            newErrors.dob.required = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            RegisterApi(inputs)
                .then((response) => {
                    const userId = response.data.idToken; 
                    const userRef = doc(db, "users", userId);
                    setDoc(userRef, {
                        name: inputs.name,
                        email: inputs.email,
                        gender: inputs.gender,
                        dob: inputs.dob,
                    })
                    .then(() => {
                        console.log("User data stored in Firestore");
                    })
                    .catch((error) => {
                        console.error("Error adding user document: ", error);
                    });

                    signInWithEmailAndPassword(auth, inputs.email, inputs.password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            storeUserData(response.data.idToken); 

                            if (inputs.email.endsWith('@admin.com')) {
                                navigate('/admin-dashboard');
                            } else if (inputs.email.endsWith('@gmail.com')) {
                                navigate('/dashboard'); 
                            }
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                        });
                })
                .catch((err) => {
                    const errorMessage = err.response?.data?.error?.message;
                    if (errorMessage === "EMAIL_EXISTS") {
                        setErrors({ ...newErrors, custom_error: "This email is already registered." });
                    } else if (errorMessage?.includes('WEAK_PASSWORD')) {
                        setErrors({ ...newErrors, custom_error: "Password must be at least six characters long." });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setErrors(newErrors);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    if (isAuthenticated()) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <section className="register-page">
                <div className="register-wrapper">
                    <div className="register-background">
                    </div>
                    <div className="row">
                        <div className="register-container">
                            <h2 className="text-center">Register Now</h2>
                            <form onSubmit={handleSubmit} className="register-form" action="">
                                <div className="form-group">
                                    <label htmlFor="name" className="text-uppercase">Name</label>
                                    <input type="text" className="form-control" onChange={handleInput} name="name" id="name" />
                                    {errors.name.required ? (<span className="text-danger">Name is required.</span>) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="text-uppercase">Email</label>
                                    <input type="email" className="form-control" onChange={handleInput} name="email" id="email" />
                                    {errors.email.required ? (<span className="text-danger">Email is required.</span>) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="text-uppercase">Password</label>
                                    <div className="password-wrapper">
                                        <input
                                            className="form-control"
                                            type={passwordVisible ? "text" : "password"}
                                            onChange={handleInput}
                                            name="password"
                                            id="password"
                                        />
                                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                                            {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </span>
                                    </div>
                                    {errors.password.required ? (<span className="text-danger">Password is required.</span>) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gender" className="text-uppercase">Gender</label>
                                    <select className="form-control" onChange={handleInput} name="gender" id="gender">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender.required ? (<span className="text-danger">Gender is required.</span>) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dob" className="text-uppercase">Date of Birth</label>
                                    <input className="form-control" type="date" onChange={handleInput} name="dob" id="dob" />
                                    {errors.dob.required ? (<span className="text-danger">Date of Birth is required.</span>) : null}
                                </div>

                                <div className="form-group">
                                    {errors.custom_error && <span className="text-danger"><p>{errors.custom_error}</p></span>}
                                    {loading ? (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    ) : null}
                                    <input type="submit" className="btn btn-login float-right" disabled={loading} value="Register" />
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Already have an account? Please <Link to="/login">Login</Link><br/>
                                    Go back to <Link to="/">Home</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
