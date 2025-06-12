import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StockSearch from './StockSearch';
import StockDetail from './StockDetail';
import StockChart from './StockChart';

const StockExplorer = () => {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <Container className="stock-explorer-container">
      <h2 className="mb-4">Stock Explorer</h2>
      
      <Row>
        <Col lg={4}>
          <StockSearch onSelectStock={handleSelectStock} />
        </Col>
        
        <Col lg={8}>
          {selectedStock && (
            <>
              <StockDetail symbol={selectedStock.symbol} />
              <StockChart symbol={selectedStock.symbol} />
            </>
          )}
          
          {!selectedStock && (
            <div className="text-center p-5 bg-light rounded">
              <h4>Search for a stock to view details</h4>
              <p className="text-muted">
                Use the search box to find stocks by company name or symbol
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StockExplorer;
