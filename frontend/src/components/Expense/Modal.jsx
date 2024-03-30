import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './Modal.css';


const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleAmountChange = (e) => {
    const { value } = e.target;
    setAmount(value);
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setDate(value);
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
  };

  const handleSubmit = async () => {
    console.log("inside modal.......");
    console.log(amount, date, description);
    await onSubmit(amount, date, description);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Details</h2>
        <input type="text" name="amount" placeholder="Enter Amount" onChange={handleAmountChange} />
        <input type="text" name="date" placeholder="Enter Date" onChange={handleDateChange} />
        <input type="text" name="description" placeholder="Enter Description" onChange={handleDescriptionChange} />

            <br />
        <Button variant="contained" type="button" onClick={handleSubmit}>Submit</Button>
        <Button variant="contained" type="button" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default Modal;
