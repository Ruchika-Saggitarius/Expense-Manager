/*
This file creates a login form for the user to login to their account with email and password
*/

import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import ApiHandler from "../../utils/apiHandler";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoggedInSuccess, setIsLoggedInSuccess] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else {
            setPassword(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let isEmailValidated = true;
        let isPasswordValidated = true;

        if (!email) {
            setErrors((prevState) => ({ ...prevState, email: 'Email is required' }));
            isEmailValidated = false;
            // eslint-disable-next-line no-useless-escape
        } else if (/^[\w_+!#$%*^&\-\.]+@[\w]+(\.\w+){1,}$/.test(email)) {
            setErrors((prevState) => ({ ...prevState, email: '' }));
            isEmailValidated = true;
        } else {
            setErrors((prevState) => ({ ...prevState, email: 'Please enter valid Email' }));
            isEmailValidated = false;
        }

        if (!password) {
            setErrors((prevState) => ({ ...prevState, password: 'Password is required' }));
            isPasswordValidated = false;
        } else {
            setErrors((prevState) => ({ ...prevState, password: '' }));
            isPasswordValidated = true;
        }

        if (isEmailValidated && isPasswordValidated) {
            ApiHandler.login(email, password).then((res) => {
                    if (res.status === 200) {
                        console.log(res.message);
                        const token = res.data.token;
                        localStorage.setItem("token", token);
                        setIsLoggedInSuccess(true);
                        navigate("/expense");
                    }
                }, () => {
                    setIsLoggedInSuccess(false);
                }
            ).catch ((err) => {
                setIsLoggedInSuccess(false);
                console.log(err);
                if (err.response.status === 400 && err.response.data.error === 'User does not exist.') {
                    setErrors((prevState) => ({ ...prevState, email: 'User does not exist.' }));
                }
                if (err.response.status === 400 && err.response.data.error === 'Invalid password.') {
                    setErrors((prevState) => ({ ...prevState, password: 'Invalid password.' }));
                }
            }
            );
        } else {
            console.log('Login unsuccessful', errors);
            setEmail('');
            setPassword('');
            setErrors({});
        }

    };

    return (
        <div className="form-container">
            <form
                onSubmit={handleSubmit}
            >
                <Typography variant="h4">Login</Typography>
                <TextField
                    name="email"
                    variant="outlined"
                    label="Email"
                    fullWidth
                    required
                    onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
                <TextField
                    name="password"
                    variant="outlined"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}

                {!isLoggedInSuccess && <span className="error">Invalid email or password</span>}
                <div className="button-container">
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                    <Typography variant="body1">
                        New User? <a href="/register">Register</a>
                    </Typography>
                    <Typography variant="body1">
                        Forgot Password? <a href="/reset-password">Reset Password</a>
                    </Typography>
                </div>
            </form>
        </div>
    );
}

export default Login;