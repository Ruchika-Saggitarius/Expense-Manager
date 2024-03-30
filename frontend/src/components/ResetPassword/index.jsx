import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import ApiHandler from "../../utils/apiHandler";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else {
            setNewPassword(value);
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

        if (!newPassword) {
            setErrors((prevState) => ({ ...prevState, newPassword: 'Password is required' }));
            isPasswordValidated = false;
        } else if (newPassword.length < 5) {
            setErrors((prevState) => ({ ...prevState, newPassword: 'Password should be at least 8 characters long' }));
            isPasswordValidated = false;
        } else if (/^[A-Za-z\d@$!%*#?&_]+$/.test(newPassword)) {
            setErrors((prevState) => ({ ...prevState, newPassword: '' }));
            isPasswordValidated = true;
        } else {
            setErrors((prevState) => ({ ...prevState, newPassword: 'Password can contain only alpha-numeric and special characters' }));
            isPasswordValidated = false;
        }

        if (isEmailValidated && isPasswordValidated) {
            ApiHandler.resetPassword(email, newPassword).then((res) => {
                if (res.status === 200) {
                    console.log(res.message);
                    navigate("/login");
                }
            }).catch((err) => {
                if (err.response.status === 400 && err.response.data.error === 'User does not exist.') {
                    setErrors((prevState) => ({ ...prevState, email: 'User does not exist.' }));
                    setEmail("");
                    setNewPassword("");
                }
            });
        } else {
            console.log('reset password unsuccessful', errors);
            setEmail("");
            setNewPassword("");
        }

        setEmail("");
        setNewPassword("");
    };

    return (
        <div className="form-container">
            <form
                onSubmit={handleSubmit}
            >
                <Typography variant="h4">Reset Password</Typography>
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
                    name="newPassword"
                    variant="outlined"
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    onChange={handleChange}
                />
                {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                <div className="button-container">
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                    </Button>
                    <Typography variant="body1">
                        New User? <a href="/register">Register</a>
                    </Typography>
                    <Typography variant="body1">
                        Already a User? <a href="/login">Login</a>
                    </Typography>
                </div>
            </form>
        </div>
    );
}

export default ResetPassword;