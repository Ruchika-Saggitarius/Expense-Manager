/*
This file creates a registration form for the user to register for an account
taking their firstname lastname email and password using MaterialUI
*/

import React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import expenseManager from "../../expense-manager.svg";


const Home = () => {

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/login");
    }

    const navigateToSignUp = () => {
        navigate("/register");
    }

    return (
        <>
            <div className="img-container">
                <div className="left-container">
                    <Typography variant="h4">Expense Manager</Typography>
                    <div className='home-button-container'>
                        <Button variant="contained" type="button" onClick={navigateToLogin}>Login</Button>
                        <Button variant="contained" type="button" onClick={navigateToSignUp}>Sign Up</Button>
                    </div>
                </div>
                <div>

                    <img src={expenseManager} alt="logo" />
                </div>
            </div>

        </>

    );
}

export default Home;
