/*
This file creates a registration form for the user to register for an account
taking their firstname lastname email and password using MaterialUI
*/

import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import ApiHandler from "../../utils/apiHandler";
import { useNavigate } from "react-router-dom";


const Register = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "userName") {
            setUserName(value);
        } else if (name === "email") {
            setEmail(value);
        } else {
            setPassword(value);
        }
    };

    const handleSubmit = (e) => {
        let isUserNameValidated = true;
        let isEmailValidated = true;
        let isPasswordValidated = true;
        e.preventDefault();

        if (!userName) {
            setErrors((prevState) => ({ ...prevState, userName: 'Name is required' }));
            isUserNameValidated = false;
          } else if (/^[a-zA-Z\s]+$/.test(userName)) {
            setErrors((prevState) => ({ ...prevState, userName: '' }));
            isUserNameValidated = true;
          } else {
            setErrors((prevState) => ({ ...prevState, userName: 'Name can contain only alphabets' }));
            isUserNameValidated = false;
          }
      
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
          } else if (password.length < 5) {
            setErrors((prevState) => ({ ...prevState, password: 'Password should be at least 8 characters long' }));
            isPasswordValidated = false;
          } else if (/^[A-Za-z\d@$!%*#?&_]+$/.test(password)) {
            setErrors((prevState) => ({ ...prevState, password: '' }));
            isPasswordValidated = true;
          } else {
            setErrors((prevState) => ({ ...prevState, password: 'Password can contain only alpha-numeric and special characters' }));
            isPasswordValidated = false;
          }

          if (isUserNameValidated && isEmailValidated && isPasswordValidated) {
            ApiHandler.register(userName, email, password).then((res) => {
                console.log(res.message);
                if (res.status === 200) {
                    navigate("/login");
                }
            }).catch((err) => {
              if (err.response.status === 400 && err.response.data.error === 'User already exists.') {
                setErrors((prevState) => ({ ...prevState, email: 'User already exists.' }));
              }
            });
          } else {
            console.log('registration unsuccessful', errors);
          }
        };

    return (
        <div className="form-container">
            <form
                onSubmit={handleSubmit}
            >
                <Typography variant="h4">Register</Typography>
                <TextField
                    name="userName"
                    variant="outlined"
                    label="Name"
                    fullWidth
                    required
                    onChange={handleChange}
                />
                {errors.userName && <span className="error">{errors.userName}</span>}
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
                <div className="button-container">
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                    >
                        Register
                    </Button>
                    <Typography variant="body1">
                        Already have an account? <a href="/login">Login</a>
                    </Typography>
                </div>
            </form>
        </div>
    );
}

export default Register;
