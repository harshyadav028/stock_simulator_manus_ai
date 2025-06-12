import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StockDetail = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`${API_URL}/stocks/quote/${symbol}`);
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to load stock data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!stockData) {
    return <Alert variant="info">Select a stock to view details</Alert>;
  }

  // Calculate price change percentage
  const priceChangePercent = stockData.regularMarketChangePercent?.toFixed(2) || 0;
  const isPriceUp = priceChangePercent >= 0;

  return (
    <Card className="stock-detail-card mb-4">
      <Card.Header>
        <h4>{stockData.shortName || stockData.longName}</h4>
        <div className="d-flex justify-content-between">
          <span>{stockData.symbol}</span>
          <Badge bg="secondary">{stockData.fullExchangeName}</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="price-container">
              <h2>${stockData.regularMarketPrice?.toFixed(2)}</h2>
              <span className={`price-change ${isPriceUp ? 'text-success' : 'text-danger'}`}>
                {isPriceUp ? '+' : ''}{stockData.regularMarketChange?.toFixed(2)} ({priceChangePercent}%)
              </span>
            </div>
            <p className="text-muted">Market {stockData.marketState}</p>
          </Col>
          <Col md={6}>
            <div className="stock-stats">
              <div className="stat-row">
                <span className="stat-label">Open:</span>
                <span className="stat-value">${stockData.regularMarketOpen?.toFixed(2)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">High:</span>
                <span className="stat-value">${stockData.regularMarketDayHigh?.toFixed(2)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Low:</span>
                <span className="stat-value">${stockData.regularMarketDayLow?.toFixed(2)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Volume:</span>
                <span className="stat-value">{stockData.regularMarketVolume?.toLocaleString()}</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <div className="stat-row">
              <span className="stat-label">52-Week High:</span>
              <span className="stat-value">${stockData.fiftyTwoWeekHigh?.toFixed(2)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">52-Week Low:</span>
              <span className="stat-value">${stockData.fiftyTwoWeekLow?.toFixed(2)}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="stat-row">
              <span className="stat-label">Market Cap:</span>
              <span className="stat-value">
                {stockData.marketCap ? `$${(stockData.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">P/E Ratio:</span>
              <span className="stat-value">{stockData.trailingPE?.toFixed(2) || 'N/A'}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StockDetail;
