import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  // Mock data for initial dashboard view
  const portfolioValue = 112350.75;
  const initialBalance = 100000;
  const cashBalance = 25420.30;
  const investedAmount = portfolioValue - cashBalance;
  const totalGain = portfolioValue - initialBalance;
  const totalGainPercent = (totalGain / initialBalance) * 100;
  
  // Mock portfolio holdings
  const topHoldings = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, price: 187.25, value: 2808.75, change: 1.25 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 10, price: 412.65, value: 4126.50, change: 2.35 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, price: 175.85, value: 1406.80, change: -0.75 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 12, price: 182.30, value: 2187.60, change: 0.45 },
  ];

  return (
    <Container className="dashboard-container py-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Portfolio Value</Card.Title>
              <h3 className="text-primary">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className={totalGain >= 0 ? 'text-success' : 'text-danger'}>
                {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalGainPercent.toFixed(2)}%)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Cash Balance</Card.Title>
              <h3 className="text-success">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className="text-muted">
                Available for trading
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Invested Amount</Card.Title>
              <h3 className="text-info">${investedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className="text-muted">
                Current market value
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-3">
          <Card className="h-100 dashboard-card">
            <Card.Body>
              <Card.Title>Initial Balance</Card.Title>
              <h3 className="text-secondary">${initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <Card.Text className="text-muted">
                Starting capital
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Portfolio Holdings</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Company</th>
                      <th>Shares</th>
                      <th>Price</th>
                      <th>Value</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHoldings.map(stock => (
                      <tr key={stock.symbol}>
                        <td><strong>{stock.symbol}</strong></td>
                        <td>{stock.name}</td>
                        <td>{stock.shares}</td>
                        <td>${stock.price.toFixed(2)}</td>
                        <td>${stock.value.toFixed(2)}</td>
                        <td className={stock.change >= 0 ? 'text-success' : 'text-danger'}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-3">
                <a href="/portfolio" className="btn btn-outline-primary">View Full Portfolio</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-3">
          <Card className="dashboard-card h-100">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <a href="/stocks" className="btn btn-primary">Explore Stocks</a>
                <a href="/trade" className="btn btn-success">Trade Stocks</a>
                <a href="/watchlist" className="btn btn-info">Manage Watchlists</a>
                <a href="/transactions" className="btn btn-secondary">View Transactions</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Market Overview</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-center text-muted">
                Market overview chart will be displayed here
              </p>
              <div className="text-center py-5 bg-light rounded">
                <h6>Market Indices Chart Placeholder</h6>
                <p className="text-muted">Real-time market data will be displayed here</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
