// StockModal.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import './AddStockModal.css';

const AddStockModal = ({ isOpen, closeModal, onAdd }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    // Create a new stock object from the form data
    const newStock = {
      symbol,
      name,
      price: parseFloat(price), // Convert to a number
    };

    // Make the API call to add the new stock using Axios
    axios.post(`${process.env.REACT_APP_API_BASE}:${process.env.REACT_APP_API_PORT}/api/add_stock`, newStock)
      .then(response => {
        console.log("Stock added successfully.", response.data);
      })
      .catch(error => {
        console.error('API error:', error);
      });

    // Clear form fields and close the modal
    setSymbol('');
    setName('');
    setPrice('');
    closeModal();
    onAdd();
  };

  return (
    <Modal show={isOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Remember to add the stock details below:</p>
        <form>
          <label>Symbol:</label>
          <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />

          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button className='app-button' variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button className='app-button' variant="primary" onClick={handleSubmit} disabled={!symbol || !name || isNaN(price) || price <= 0}>
          Add Stock
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStockModal;