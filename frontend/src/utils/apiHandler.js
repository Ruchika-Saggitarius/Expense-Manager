import axios from 'axios';

// get base url from .env file
const BASE_URL = process.env.REACT_APP_BASE_URL;
const ApiHandler = {
  register(name, email, password) {
    return axios.post(`${BASE_URL}/user/register-user`, {
     name, email, password,
    });
  },

  login(email, password) {
    return axios.post(`${BASE_URL}/user/login-user`, {
      email, password,
    });
  },

  resetPassword(email, newPassword) {
    return axios.post(`${BASE_URL}/user/reset-password`, {
      email, newPassword,
    });
  },

  createExpense(token, category, amount, date, description) {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
    return axios.post(`${BASE_URL}/expense/create-expense`, {
      category, amount, date, description,
    }, { headers });
  },

  deleteExpense(token, expenseId) {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
    return axios.post(`${BASE_URL}/expense/delete-expense`, {
      expenseId 
    }, { headers }); 
  },

  updateExpense(token, expenseId, category, amount, date, description) {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
    return axios.put(`${BASE_URL}/expense/update-expense`, {
      expenseId, category, amount, date, description,
    }, { headers });
  },

  getExpenses(token) {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
    return axios.get(`${BASE_URL}/expense/get-expenses`, { headers });
  },

  getBalance(token) {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    };
    return axios.get(`${BASE_URL}/expense/get-balance`, { headers });
  },
};

export default ApiHandler;
