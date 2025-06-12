import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form } from 'react-bootstrap';

const Portfolio = () => {
  // Mock data for portfolio
  const [portfolio, setPortfolio] = useState({
    totalValue: 86930.45,
    cashBalance: 25420.30,
    initialBalance: 100000,
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, avgPrice: 165.32, currentPrice: 187.25, value: 2808.75, gain: 328.95, gainPercent: 13.26 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 10, avgPrice: 380.15, currentPrice: 412.65, value: 4126.50, gain: 325.00, gainPercent: 8.55 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, avgPrice: 160.42, currentPrice: 175.85, value: 1406.80, gain: 123.44, gainPercent: 9.62 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 12, avgPrice: 165.80, currentPrice: 182.30, value: 2187.60, gain: 198.00, gainPercent: 9.95 },
      { symbol: 'TSLA', name: 'Tesla Inc.', shares: 20, avgPrice: 210.45, currentPrice: 172.82, value: 3456.40, gain: -752.60, gainPercent: -17.88 },
      { symbol: 'META', name: 'Meta Platforms Inc.', shares: 18, avgPrice: 310.25, currentPrice: 485.39, value: 8737.02, gain: 3152.52, gainPercent: 56.45 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 5, avgPrice: 420.75, currentPrice: 879.93, value: 4399.65, gain: 2295.90, gainPercent: 109.15 },
    ]
  });

  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('');

  const totalInvested = portfolio.stocks.reduce((total, stock) => total + (stock.avgPrice * stock.shares), 0);
  const totalGain = portfolio.totalValue - portfolio.initialBalance;
  const totalGainPercent = (totalGain / portfolio.initialBalance) * 100;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStocks = [...portfolio.stocks]
    .filter(stock => 
      filter === '' || 
      stock.symbol.toLowerCase().includes(filter.toLowerCase()) || 
      stock.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'shares':
          comparison = a.shares - b.shares;
          break;
        case 'avgPrice':
          comparison = a.avgPrice - b.avgPrice;
          break;
        case 'currentPrice':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'gain':
          comparison = a.gain - b.gain;
          break;
        case 'gainPercent':
          comparison = a.gainPercent - b.gainPercent;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <Container className="portfolio-container py-4">
      <h1 className="mb-4">Portfolio</h1>
      
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 portfolio-card">
            <Card.Body>
              <Card.Title>Portfolio Value</Card.Title>
              <h3 className="text-primary">${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className={totalGain >= 0 ? 'text-success' : 'text-danger'}>
                {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalGainPercent.toFixed(2)}%)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 portfolio-card">
            <Card.Body>
              <Card.Title>Cash Balance</Card.Title>
              <h3 className="text-success">${portfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className="text-muted">
                Available for trading
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 portfolio-card">
            <Card.Body>
              <Card.Title>Invested Amount</Card.Title>
              <h3 className="text-info">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className="text-muted">
                Total cost basis
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 portfolio-card">
            <Card.Body>
              <Card.Title>Holdings</Card.Title>
              <h3 className="text-secondary">{portfolio.stocks.length}</h3>
              <Card.Text className="text-muted">
                Different stocks
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Portfolio Holdings</h5>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Filter stocks..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="me-2"
              style={{ width: '200px' }}
            />
            <Button variant="outline-primary" size="sm" href="/trade">
              Trade Stocks
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="portfolio-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('symbol')} className="sortable">
                    Symbol {sortField === 'symbol' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Company {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('shares')} className="sortable text-end">
                    Shares {sortField === 'shares' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('avgPrice')} className="sortable text-end">
                    Avg. Price {sortField === 'avgPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('currentPrice')} className="sortable text-end">
                    Current Price {sortField === 'currentPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('value')} className="sortable text-end">
                    Value {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('gain')} className="sortable text-end">
                    Gain/Loss {sortField === 'gain' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('gainPercent')} className="sortable text-end">
                    % Change {sortField === 'gainPercent' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStocks.map(stock => (
                  <tr key={stock.symbol}>
                    <td><strong>{stock.symbol}</strong></td>
                    <td>{stock.name}</td>
                    <td className="text-end">{stock.shares}</td>
                    <td className="text-end">${stock.avgPrice.toFixed(2)}</td>
                    <td className="text-end">${stock.currentPrice.toFixed(2)}</td>
                    <td className="text-end">${stock.value.toFixed(2)}</td>
                    <td className={`text-end ${stock.gain >= 0 ? 'text-success' : 'text-danger'}`}>
                      {stock.gain >= 0 ? '+' : ''}${stock.gain.toFixed(2)}
                    </td>
                    <td className={`text-end ${stock.gainPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {stock.gainPercent >= 0 ? '+' : ''}{stock.gainPercent.toFixed(2)}%
                    </td>
                    <td className="text-center">
                      <Button variant="success" size="sm" className="me-1" href={`/trade?symbol=${stock.symbol}&action=buy`}>
                        Buy
                      </Button>
                      <Button variant="danger" size="sm" href={`/trade?symbol=${stock.symbol}&action=sell`}>
                        Sell
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {sortedStocks.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      {filter ? 'No stocks match your filter criteria.' : 'Your portfolio is empty. Start trading to add stocks.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Portfolio Allocation</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-center text-muted">
                Portfolio allocation chart will be displayed here
              </p>
              <div className="text-center py-5 bg-light rounded">
                <h6>Portfolio Allocation Chart Placeholder</h6>
                <p className="text-muted">Visual representation of your portfolio allocation</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Portfolio;
