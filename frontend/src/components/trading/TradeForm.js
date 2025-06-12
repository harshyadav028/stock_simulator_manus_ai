import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import StockSearch from '../stocks/StockSearch';
import StockDetail from '../stocks/StockDetail';
import StockChart from '../stocks/StockChart';

const TradeForm = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const cashBalance = 25420.30;
  const stockPrice = selectedStock ? 185.75 : 0; // Mock price
  const totalCost = stockPrice * quantity;
  const canAfford = cashBalance >= totalCost;

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setError('');
    setSuccess('');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedStock) {
      setError('Please select a stock to trade');
      return;
    }
    
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    
    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      setError('Please enter a valid limit price');
      return;
    }
    
    if (tradeType === 'buy' && !canAfford) {
      setError('Insufficient funds for this purchase');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(`Successfully ${tradeType === 'buy' ? 'purchased' : 'sold'} ${quantity} shares of ${selectedStock.symbol}`);
      
      // Reset form
      setQuantity(1);
      if (orderType === 'limit') {
        setLimitPrice('');
      }
    }, 1500);
  };

  return (
    <Container className="trade-container py-4">
      <h1 className="mb-4">Trade Stocks</h1>
      
      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Search Stocks</h5>
            </Card.Header>
            <Card.Body>
              <StockSearch onSelectStock={handleSelectStock} />
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Trade Form</h5>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Trade Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      id="buy"
                      label="Buy"
                      name="tradeType"
                      value="buy"
                      checked={tradeType === 'buy'}
                      onChange={() => setTradeType('buy')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="sell"
                      label="Sell"
                      name="tradeType"
                      value="sell"
                      checked={tradeType === 'sell'}
                      onChange={() => setTradeType('sell')}
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Order Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      id="market"
                      label="Market"
                      name="orderType"
                      value="market"
                      checked={orderType === 'market'}
                      onChange={() => setOrderType('market')}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="limit"
                      label="Limit"
                      name="orderType"
                      value="limit"
                      checked={orderType === 'limit'}
                      onChange={() => setOrderType('limit')}
                    />
                  </div>
                </Form.Group>
                
                {orderType === 'limit' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Limit Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <InputGroup>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      required
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </InputGroup>
                </Form.Group>
                
                {selectedStock && (
                  <div className="trade-summary mb-3">
                    <h6>Trade Summary</h6>
                    <div className="d-flex justify-content-between">
                      <span>Stock:</span>
                      <strong>{selectedStock.symbol}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Price per share:</span>
                      <strong>${stockPrice.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Quantity:</span>
                      <strong>{quantity}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Total {tradeType === 'buy' ? 'cost' : 'value'}:</span>
                      <strong>${totalCost.toFixed(2)}</strong>
                    </div>
                    {tradeType === 'buy' && (
                      <div className="d-flex justify-content-between">
                        <span>Cash balance after trade:</span>
                        <strong className={canAfford ? 'text-success' : 'text-danger'}>
                          ${(cashBalance - totalCost).toFixed(2)}
                        </strong>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="d-grid">
                  <Button 
                    variant={tradeType === 'buy' ? 'success' : 'danger'} 
                    type="submit"
                    disabled={!selectedStock || isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedStock ? selectedStock.symbol : 'Stock'}`}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          {selectedStock ? (
            <>
              <StockDetail symbol={selectedStock.symbol} />
              <StockChart symbol={selectedStock.symbol} />
            </>
          ) : (
            <Card className="text-center p-5">
              <Card.Body>
                <h4>Select a stock to trade</h4>
                <p className="text-muted">
                  Use the search box to find stocks by company name or symbol
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TradeForm;
