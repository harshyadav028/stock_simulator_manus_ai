import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StockSearch = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/stocks/search`, {
        params: { query: query.trim() }
      });
      
      if (response.data.quotes && response.data.quotes.length > 0) {
        setResults(response.data.quotes);
      } else {
        setResults([]);
        setError('No stocks found matching your search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search for stocks. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = (stock) => {
    if (onSelectStock) {
      onSelectStock(stock);
    }
  };

  return (
    <div className="stock-search mb-4">
      <Form onSubmit={handleSearch}>
        <Form.Group>
          <Form.Label>Search for stocks</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter company name or symbol (e.g., AAPL, Tesla)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            Search by company name or stock symbol
          </Form.Text>
        </Form.Group>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {results.length > 0 && (
        <div className="search-results mt-3">
          <h5>Search Results</h5>
          <div className="list-group">
            {results.map((stock) => (
              <button
                key={stock.symbol}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => handleSelectStock(stock)}
              >
                <div>
                  <strong>{stock.symbol}</strong> - {stock.shortname || stock.longname}
                </div>
                <span className="badge bg-primary rounded-pill">{stock.exchDisp}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
