import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import axios from 'axios';

const DeleteStockModal = ({ show, onHide, stocks, onDelete }) => {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleDelete = () => {
    if (selectedStock) {
      const symbol = selectedStock.value;

      axios.delete(`https://stock-price-tracker-backend.vercel.app/api/delete_stock/${symbol}`)
        .then(() => {
          onDelete(); // Notify the parent component that a stock has been deleted
        })
        .catch((error) => {
          console.error('Error deleting stock:', error);
        });
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Select
          options={stocks}
          onChange={selectedOption => setSelectedStock(selectedOption)}
          placeholder="Select a stock to delete"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className='app-button' variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button className='app-button' disabled={!selectedStock} variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteStockModal;