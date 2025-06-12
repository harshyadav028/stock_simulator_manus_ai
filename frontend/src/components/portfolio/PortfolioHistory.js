import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PortfolioHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [period, setPeriod] = useState('1m');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolioHistory = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/portfolio/history`, {
          params: { period },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching portfolio history:', error);
        setError('Failed to load portfolio history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolioHistory();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  // Prepare chart data
  const chartData = {
    labels: historyData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Value',
        data: historyData.map(entry => entry.totalValue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Portfolio Value',
        data: historyData.map(entry => entry.portfolioValue),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Cash Balance',
        data: historyData.map(entry => entry.cashBalance),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Portfolio Performance History'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <Container className="portfolio-history-container py-4">
      <h2 className="mb-4">Portfolio History</h2>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Performance Over Time</h5>
          <Form.Select 
            value={period}
            onChange={handlePeriodChange}
            style={{ width: 'auto' }}
          >
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="all">All Time</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : historyData.length === 0 ? (
            <div className="text-center py-5">
              <p>No historical data available yet. Check back after making some trades.</p>
            </div>
          ) : (
            <div className="chart-container" style={{ height: '400px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              {historyData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Start Value</th>
                        <th>Current Value</th>
                        <th>Change</th>
                        <th>% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Value</td>
                        <td>${historyData[0].totalValue.toFixed(2)}</td>
                        <td>${historyData[historyData.length - 1].totalValue.toFixed(2)}</td>
                        <td className={historyData[historyData.length - 1].totalValue - historyData[0].totalValue >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].totalValue - historyData[0].totalValue) >= 0 ? '+' : ''}
                          ${(historyData[historyData.length - 1].totalValue - historyData[0].totalValue).toFixed(2)}
                        </td>
                        <td className={historyData[historyData.length - 1].totalValue - historyData[0].totalValue >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].totalValue - historyData[0].totalValue) >= 0 ? '+' : ''}
                          {(((historyData[historyData.length - 1].totalValue - historyData[0].totalValue) / historyData[0].totalValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td>Portfolio Value</td>
                        <td>${historyData[0].portfolioValue.toFixed(2)}</td>
                        <td>${historyData[historyData.length - 1].portfolioValue.toFixed(2)}</td>
                        <td className={historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue) >= 0 ? '+' : ''}
                          ${(historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue).toFixed(2)}
                        </td>
                        <td className={historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue) >= 0 ? '+' : ''}
                          {(((historyData[historyData.length - 1].portfolioValue - historyData[0].portfolioValue) / historyData[0].portfolioValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                      <tr>
                        <td>Cash Balance</td>
                        <td>${historyData[0].cashBalance.toFixed(2)}</td>
                        <td>${historyData[historyData.length - 1].cashBalance.toFixed(2)}</td>
                        <td className={historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance) >= 0 ? '+' : ''}
                          ${(historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance).toFixed(2)}
                        </td>
                        <td className={historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance >= 0 ? 'text-success' : 'text-danger'}>
                          {(historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance) >= 0 ? '+' : ''}
                          {(((historyData[historyData.length - 1].cashBalance - historyData[0].cashBalance) / historyData[0].cashBalance) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-3">No historical data available yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PortfolioHistory;
