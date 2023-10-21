import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import AddStockModal from '../AddStocksModal/AddStockModal';
import { Alert, Button, Col, Dropdown, ProgressBar, Row } from 'react-bootstrap';
import './StockPriceDisplay.css';
import StockTable from '../StockTable/StockTable';
import logo from '../../images/logo.png';
import StockChart from '../StockChart/StockChart';
import DeleteStockModal from '../DeleteStockModal/DeleteStockModal';

const StockPriceDisplay = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [price, setPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [refetchToggle, setRefetchToggle] = useState(false);
  const [chartData, setChartData] = useState({labels: [], priceHistory: []});
  const [countdown, setCountdown] = useState(parseInt(process.env.REACT_APP_UPDATE_SECONDS));

  const MAX_DATA_POINTS_ALLOWED = useMemo(() => 20, []);
  const SHOW_CHART_AT = useMemo(() => 2, []);

  const fetchAvailableStocks = async () => {
    try {
        const response = await axios.get(`https://stock-price-tracker-backend.vercel.app/api/stock_names`)
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
  }
  
  useEffect(() => {
    fetchAvailableStocks().then(response => setAvailableStocks(response)).catch(err => console.error(err));
  }, [refetchToggle]);

  useEffect(() => {
    if(chartData.labels.length === MAX_DATA_POINTS_ALLOWED) {
      const updatedLabels = chartData.labels.slice(1);
      const updatedPriceHistory = chartData.priceHistory.slice(1);

      const newData = {
        labels: updatedLabels,
        priceHistory: updatedPriceHistory,
      };

      setChartData(newData);
    }
  }, [chartData]);

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await axios.get(`https://stock-price-tracker-backend.vercel.app/api/stock/${symbol}`);
      setPrice(response.data.price);

      setChartData(c => ({...c, 
        labels: [...c.labels, new Date().valueOf()], 
        priceHistory: [...c.priceHistory, response.data.price]
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  useEffect(() => {
    setCountdown(parseInt(process.env.REACT_APP_UPDATE_SECONDS));
    if (selectedStock) {
      fetchStockPrice(selectedStock.value);

      const intervalId = setInterval(() => {
        fetchStockPrice(selectedStock.value);
        setCountdown(parseInt(process.env.REACT_APP_UPDATE_SECONDS));
      }, parseInt(process.env.REACT_APP_UPDATE_SECONDS)*1000); // Fetch every minute

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [selectedStock]);

  return (
    <div>
      <Row className='logo-row'>
        <img className='logo-image' src={logo} />
      </Row>

      <Row>
        <Col xs={12}>
          <Dropdown className='add-stock-button'>
            <Dropdown.Toggle className='app-button' variant="success" id="dropdown-basic">
              Add/Delete Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsModalOpen(true)}>Add Stock</Dropdown.Item>
              <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Delete Stock</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {availableStocks.length >= 0 && <Select
        options={availableStocks}
        value={selectedStock}
        onChange={(selectedOption) => {
          setSelectedStock(selectedOption);
          setChartData({labels: [], priceHistory: []});
        }}
      />}

      {
        selectedStock && 
        <div>
          <p className='timer'>Next update in: <span className='seconds'>{countdown} seconds</span></p>
        </div>
      }
      
      {selectedStock && (
        <div>
          <StockTable
            stockName={selectedStock.label}
            stockPrice={price}
          />
        </div>
      )}

      {
        chartData.labels.length >= SHOW_CHART_AT ? 
        <>
          <Alert key={"primary"} variant={"primary"}>
            At max, {MAX_DATA_POINTS_ALLOWED} data points will be shown on the chart.
          </Alert>
          <StockChart data={chartData} />
        </> : 
        selectedStock && <ProgressBar 
          now={((process.env.REACT_APP_UPDATE_SECONDS - countdown) / process.env.REACT_APP_UPDATE_SECONDS)*100} 
          label={`Loading chart, ${(((process.env.REACT_APP_UPDATE_SECONDS - countdown) / process.env.REACT_APP_UPDATE_SECONDS)*100).toFixed(2)}% done`} 
        />
      }
      <AddStockModal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)}
         onAdd={
            () => {
              setAvailableStocks([]);
              setSelectedStock(null);
              setChartData({labels: [], priceHistory: []});
              setRefetchToggle(c => !c);
              setCountdown(parseInt(process.env.REACT_APP_UPDATE_SECONDS))
          }
        }
      />
      <DeleteStockModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        stocks={availableStocks} // Pass your stock data array here
        onDelete={() => {
          setAvailableStocks([]);
          setRefetchToggle(c => !c);
          setSelectedStock(null);
          setChartData({labels: [], priceHistory: []});
          setCountdown(parseInt(process.env.REACT_APP_UPDATE_SECONDS))
        }}
      />
    </div>
  );
};

export default StockPriceDisplay;