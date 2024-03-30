import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { React } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Expense from './components/Expense';
import ResetPassword from './components/ResetPassword';
import Container from '@mui/material/Container';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <Container maxWidth="md" className='container-style'>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
export default App;