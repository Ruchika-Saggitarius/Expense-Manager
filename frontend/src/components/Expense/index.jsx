/*
This file is use to show the expense list of the user and give the option to add new expense
Also it shows the total expense of the user. Delete and update is also available with each expense
*/

import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiHandler from "../../utils/apiHandler";
import jwt_decode from "jwt-decode";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from "./Modal";
import Typography from '@mui/material/Typography';

const Expense = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
    }
    const decoded = jwt_decode(token);
    const { id } = decoded;
    const { email } = decoded;

    useEffect(() => {
        ApiHandler.getExpenses(token).then((res) => {
            if (res.status === 200) {
                setExpenses(res.data.expenses);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, [setExpenses, token]);

    useEffect(() => {
        ApiHandler.getBalance(token).then((res) => {
            if (res.status === 200) {
                setBalance(res.data.balance);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, [setBalance, token]);

    const openExpenseModal = () => {
        setExpenseModalOpen(true);
        setIncomeModalOpen(false);
    };

    const openIncomeModal = () => {
        setIncomeModalOpen(true);
        setExpenseModalOpen(false);
    };

    const closeExpenseModal = () => {
        setExpenseModalOpen(false);
    };

    const closeIncomeModal = () => {
        setIncomeModalOpen(false);
    };


    const handleAddExpense = async (amount, date, description) => {
        console.log("......................");
        console.log(amount, date, description);
        console.log("......................");
        // cast amount to integer
        amount = parseInt(amount);
        const category = "expense";
        await ApiHandler.createExpense(token, category, amount, date, description).then((res) => {
            if (res.status === 200) {
                console.log(res.message);
                setExpenseModalOpen(false);
                setExpenses(res.data.expenses);
                setBalance(res.data.balance);
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    const handleAddIncome = async (amount, date, description) => {
        console.log("......................");
        console.log(amount, date, description);
        console.log("......................");
        // cast amount to integer
        amount = parseInt(amount);
        const category = "income";
        await ApiHandler.createExpense(token, category, amount, date, description).then((res) => {
            if (res.status === 200) {
                console.log(res.message);
                setIncomeModalOpen(false);
                setExpenses(res.data.expenses);
                setBalance(res.data.balance);
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    const handleDeleteExpense = async (expenseId) => {
        console.log("......................");
        console.log(expenseId);
        console.log("......................");
        await ApiHandler.deleteExpense(token, expenseId).then((res) => {
            if (res.status === 200) {
                console.log(res.message);
                setExpenses(res.data.expenses);
                setBalance(res.data.balance);
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <>
            <div className="sub-container">
                <Typography variant="h6">Welcome {email}</Typography>
                <Button variant="contained" type="button" onClick={() => handleLogout()}>LOGOUT</Button>
            </div>
            <br />
            <br />
            <Typography variant="h4">Expenses and Income</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">CATEGORY</TableCell>
                            <TableCell align="left">AMOUNT</TableCell>
                            <TableCell align="left">DATE</TableCell>
                            <TableCell align="left">DESCRIPTION</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.length !== 0 &&
                            expenses.map((expense) => (
                                <TableRow
                                    key={expense.expenseId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{expense.category}</TableCell>
                                    <TableCell align="left">{expense.amount}</TableCell>
                                    <TableCell align="left">{expense.date}</TableCell>
                                    <TableCell align="left">{expense.description}</TableCell>
                                    <TableCell align="left">
                                        <Button variant="contained" type="button" onClick={() => handleDeleteExpense(expense.expenseId)}>Delete Expense</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <div className='expense-button-container'>
                <Button variant="contained" type="button" onClick={openExpenseModal}>Add Expense</Button>
                <Button variant="contained" type="button" onClick={openIncomeModal}>Add Income</Button>
            </div>
            <br />
            <div className='expense-button-container'>  
            <Modal isOpen={isExpenseModalOpen} onClose={closeExpenseModal} onSubmit={handleAddExpense} />
            <Modal isOpen={isIncomeModalOpen} onClose={closeIncomeModal} onSubmit={handleAddIncome} />
            </div>
            <br />
            <Typography variant="h4">Total Balance: {balance}</Typography>
        </>

    );
}

export default Expense;
